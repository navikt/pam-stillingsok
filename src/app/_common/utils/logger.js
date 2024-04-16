import winston from 'winston';

import { NAV_CALL_ID_TAG, getCallId } from '@/app/_common/monitoring/callId';

const addCallId = winston.format((info) => {
  const localInfo = info;
  localInfo[NAV_CALL_ID_TAG] = getCallId();
  return localInfo;
});

const logger = winston.createLogger({
  format: winston.format.combine(addCallId(), winston.format.json()),
  transports: [new winston.transports.Console()],
});

export default logger;
