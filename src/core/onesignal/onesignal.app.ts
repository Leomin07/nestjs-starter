import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { first } from 'lodash';
import { Client } from 'onesignal-node';
import { CreateNotificationBody } from 'onesignal-node/lib/types';
import { Notification } from 'src/database/entities/Notification';
import { Environment } from 'src/helpers/enum';
import { substrContent } from 'src/helpers/utils';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OneSignalApp {
  client: any;
  memberTag: string;
  isReceivedNotificationTag: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.client = new Client(
      this.configService.get('ONESIGNAL_APP_ID'),
      this.configService.get('ONESIGNAL_REST_API_KEY'),
    );

    this.memberTag =
      configService.get('env') !== Environment.Production
        ? `${configService.get('env')}_memberId`
        : 'memberId';

    this.isReceivedNotificationTag =
      configService.get('env') !== Environment.Production
        ? `${configService.get('env')}_isReceivedNotification`
        : 'isReceivedNotification';
  }

  chunkArray(memberIds: number[], chunkSize: number) {
    let index = 0;
    const arrayLength = memberIds.length;
    const tempArray = [];

    for (index = 0; index < arrayLength; index += chunkSize) {
      const myChunk = memberIds.slice(index, index + chunkSize);
      // Do something if you want with the group
      tempArray.push(myChunk);
    }
    return tempArray;
  }

  removeBlank(str: string) {
    return str.split(' ').join('');
  }

  async sendNotificationWithPlayerIds(
    playerIds: string[],
    title: any,
    content: any,
    data: any,
  ) {
    const notification: CreateNotificationBody = {
      headings: {
        en: title,
        vi: title,
      },
      contents: {
        en: content,
        vi: content,
      },
      data,
      android_group: `${this.removeBlank(
        this.configService.get('APP_NAME'),
      )}_notification`,
      adm_group: `${this.removeBlank(
        this.configService.get('APP_NAME'),
      )}_notification`,
      thread_id: `${this.removeBlank(
        this.configService.get('APP_NAME'),
      )}_notification`,
      include_player_ids: playerIds,
    };
    await this.client.createNotification(notification);
  }

  /**
   * method push notification all memebers
   * @param content string
   * @param data any
   */
  async adminPushNotificationToAllMember(content: string, data: any) {
    const notification: CreateNotificationBody = {
      headings: {
        en: this.removeBlank(this.configService.get('APP_NAME')),
        vi: this.removeBlank(this.configService.get('APP_NAME')),
      },
      contents: {
        en: content,
        vi: content,
      },
      data,
      android_group: `${this.configService.get('APP_NAME')}_notification`,
      adm_group: `${this.configService.get('APP_NAME')}_notification`,
      thread_id: `${this.configService.get('APP_NAME')}_notification`,
      filters: [
        {
          field: 'tag',
          key: this.memberTag,
          relation: 'exists',
        },
        {
          field: 'tag',
          key: this.isReceivedNotificationTag,
          relation: '=',
          value: 'true',
        },
      ],
    };

    await this.client.createNotification(notification);
  }

  /**
   * method push notification
   * @param memberIds
   * @param title
   * @param content
   * @param data
   * @param playerIds
   * @returns
   */
  async pushNotification(
    memberIds: number[],
    title: string,
    content: string,
    data: any,
    playerIds?: string[],
  ) {
    const notificationRepository = this.dataSource.getRepository(Notification);

    content = substrContent(content, 100);
    title = substrContent(title, 100);

    if (playerIds && playerIds.length && first(playerIds)) {
      // send by player id
      await this.sendNotificationWithPlayerIds(playerIds, title, content, data);
      return;
    }
    if (!memberIds.length) return;

    const memberIdChunk = this.chunkArray(memberIds, 100);

    for (const memberIdsItem of memberIdChunk) {
      const filters: any = [];
      memberIdsItem.forEach((x) => {
        if (filters.length > 0) {
          filters.push({
            operator: 'OR',
          });
          filters.push({
            field: 'tag',
            key: this.memberTag,
            relation: '=',
            value: x,
          });
        } else {
          filters.push({
            field: 'tag',
            key: this.memberTag,
            relation: '=',
            value: x,
          });
        }
      });
      const uuid = uuidv4();

      const notification: CreateNotificationBody = {
        headings: {
          en: title,
          vi: title,
        },
        contents: {
          en: content,
          vi: content,
        },
        data,
        android_group: `${data.type}_${data.redirectType}_${
          data.redirectId
        }${this.removeBlank(this.configService.get('APP_NAME'))}_notification`,
        adm_group: `${data.type}_${data.redirectType}_${
          data.redirectId
        }${this.removeBlank(this.configService.get('APP_NAME'))}_notification`,
        thread_id: `${data.type}_${data.redirectType}_${
          data.redirectId
        }${this.removeBlank(this.configService.get('APP_NAME'))}_notification`,
        filters,
        collapse_id: uuid,
      };

      const notificationOnesignal =
        await this.client.createNotification(notification);

      if (notificationOnesignal.statusCode === 200) {
        await notificationRepository.update(
          { id: data.notificationId },
          { uuid: Number(uuid) },
        );
      }
    }
  }
}
