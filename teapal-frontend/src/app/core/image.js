import { message } from 'antd';
import {PRE} from '../App'

export const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
}

export const uploadAvator = (file, onSuccess) => {

    if(!onSuccess){onSuccess = () => {console.log("Alter user info successfully")}}
    var timestamp = new Date().getTime();
    var img_id = "post-img-"+timestamp
    var Bucket = 'ciwk-1301216399';
    var Region = 'ap-guangzhou';     /* 存储桶所在地域，必须字段 */
    console.log(file)

    var COS = require('cos-js-sdk-v5');
    
    // 初始化实例
    var cos = new COS({
        getAuthorization: function (options, callback) {
            fetch(PRE+'/get_cos_credential')
            .then(res => res.json())
            .then(data => {
                var credentials = data && data.credentials;
                if (!data || !credentials) return console.error('credentials invalid');
                callback({
                    TmpSecretId: credentials.tmpSecretId,
                    TmpSecretKey: credentials.tmpSecretKey,
                    XCosSecurityToken: credentials.sessionToken,
                    StartTime: data.startTime,
                    ExpiredTime: data.expiredTime,
                });
            })
        }
    });
    if (cos){
        cos.putObject({
            Bucket: Bucket, /* 必须 */
            Region: Region,     /* 存储桶所在地域，必须字段 */
            Key: img_id,//result.key,              /* 必须 */
            StorageClass: 'STANDARD',
            Body: file, // 上传文件对象
            onProgress: function (progressData) {
                //console.log("Progress: ",JSON.stringify(progressData));
                //if (progressData && progressData.percent >= 1) {
                    //当上传完成的时候
                //}
            }
        }, function(err, data) {
            console.log(err || "http://"+data.Location);
            if(data){
                let url = "http://"+data.Location;
                //resolve("http://"+data.Location);
                onSuccess(url)
            }else{
                //当上传失败时
            }
        })
    }else{
        //当建立cos对象失败时
    }
}