import { ACTION, AuditLog, ENTITY_TYPE } from "@prisma/client";

export function generateLogMessage(log: AuditLog) {
  const { action, entityTitle, entityType } = log;

  const typeResolved = messageTranslation[entityType];

  if (!typeResolved) {
    return `[действие неизвестно: ${action}] сущность: ${entityType}, имя: ${entityTitle}`;
  }

  if (!entityTitle) {
    return `[объект действия неизвестен, действие: ${action}]`;
  }

  return typeResolved[action](entityTitle);
}

type AuditLogMessageGetter = (entityName: string) => string;

const messageTranslation: Record<
  ENTITY_TYPE,
  Record<ACTION, AuditLogMessageGetter>
> = {
  [ENTITY_TYPE.CARD]: {
    [ACTION.CREATE]: (entityName) => `создал(-а) задачу ${entityName}`,
    [ACTION.DELETE]: (entityName) => `удалил(-а) задачу ${entityName}`,
    [ACTION.UPDATE]: (entityName) => `обновил(-а) задачу ${entityName}`,
  },
  [ENTITY_TYPE.DOCUMENT]: {
    [ACTION.CREATE]: (entityName) => `создал(-а) файл ${entityName}`,
    [ACTION.DELETE]: (entityName) => `удалил(-а) файл ${entityName}`,
    [ACTION.UPDATE]: (entityName) => `обновил(-а) файл ${entityName}`,
  },
  [ENTITY_TYPE.BOARD]: {
    [ACTION.CREATE]: (entityName) => `создал(-а) таблицу ${entityName}`,
    [ACTION.DELETE]: (entityName) => `удалил(-а) таблицу ${entityName}`,
    [ACTION.UPDATE]: (entityName) => `обновил(-а) таблицу ${entityName}`,
  },
  [ENTITY_TYPE.LIST]: {
    [ACTION.CREATE]: (entityName) => `создал(-а) колонку ${entityName}`,
    [ACTION.DELETE]: (entityName) => `удалил(-а) колонку ${entityName}`,
    [ACTION.UPDATE]: (entityName) => `обновил(-а) колонку ${entityName}`,
  },
};
