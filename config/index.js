export const imageUrl = 'https://6a7a-jzy-1gjdmixbb2d05e5f-1322586813.tcb.qcloud.la'


// 兑换函数
export const reg = (fileId) => {
  const regex = /cloud:\/\/(.+)\.([^\/]+)\/(.+)/;
  const match = fileId.match(regex);
  if (!match) {
    return '无法兑换成https链接';
  }
  // const envId = match[1];
  const customId = match[2];
  const path = match[3];
  return `https://${customId}.tcb.qcloud.la/${path}`;
}