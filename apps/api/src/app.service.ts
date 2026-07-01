import { Injectable } from '@nestjs/common';
import { SHARED_PACKAGE_VERSION } from '@verse-dash/shared';

@Injectable()
export class AppService {
  getHello(): string {
    return `VerseDash API — shared v${SHARED_PACKAGE_VERSION}`;
  }
}
