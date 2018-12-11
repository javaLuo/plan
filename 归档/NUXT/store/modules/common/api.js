import axios from '~/store/axios'

// 上传文件
export function s3Upload(params) {
	return axios.post(`/kyc/manager/file/s3upload`, params);
}