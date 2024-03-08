import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '@/utils/http/axios';
import { UploadFileParams } from '#/axios';
import { useGlobSetting } from '@/hooks/setting';
import { AxiosProgressEvent } from 'axios';
import { ContentTypeEnum } from '@/enums/httpEnum';

const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      onUploadProgress,
    },
    params,
  );
}

/**
 * @description: Upload avatar
 */
export function uploadAvatarApi(
  params: UploadFileParams,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  const formData = new window.FormData();
  const customFilename = params.name || 'file';

  if (params.filename) {
    formData.append(customFilename, params.file, params.filename);
  } else {
    formData.append(customFilename, params.file);
  }

  return defHttp.post({
    url: `/v1/upload`,
    data: formData,
    onUploadProgress,
    headers: {
      'Content-type': ContentTypeEnum.FORM_DATA,
    },
  });
}
