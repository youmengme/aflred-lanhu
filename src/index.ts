import alfy from 'alfy'
import axios from 'axios'
import dayJs from 'dayjs'

function formatTime(time: number) {
  return dayJs(time * 1000).format('YYYY/MM/DD HH:mm:ss')
}

const envs = {
  COOKIE: '',
  TEAM_ID: '',
  PARENT_ID: 1,
  TOKEN: ''
}
const apiUrl = 'https://lanhuapp.com/workbench/api/workbench/abstractfile/list'
const data = JSON.stringify({
  'tenantId': envs.TEAM_ID,
  'parentId': envs.PARENT_ID
})

const config = {
  headers: {
    'authority': 'lanhuapp.com',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'authorization': `Basic ${envs.TOKEN}`,
    'content-type': 'application/json',
    'cookie': envs.COOKIE,
    'origin': 'https://lanhuapp.com',
    'referer': 'https://lanhuapp.com/dashboard/',
    'sec-ch-ua': '"Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36'
  }
}

/**
 *  {
 *     id: 6655759,
 *     sourceName: 'AHS官网-PRD（≥5.13.0）截止20230118',
 *     sourceType: 'dc_prj',
 *     sourceId: 'e93804e8-b24c-49b0-8d80-e5999d3d11b2',
 *     sourceShortId: '',
 *     sourceThumbnail: '',
 *     sourceBg: '(65,65,93,0.05)',
 *     parentId: 8232681,
 *     openTime: 1681954188,
 *     updateTime: 1680083022,
 *     createTime: 1656988698,
 *     orderIndex: -1000,
 *     creator: '43ac2c8b-3258-49bd-b5fa-4c557eecfd0e',
 *     role: { roleCode: '2003', inviteList: [Array], settingList: [] },
 *     opList: null
 *   }
 */
function getProjects() {
  return axios.post(apiUrl, data, config)
    .then((response) => {
      const res = response.data
      if (res.code !== 0) return Promise.resolve([])
      return Promise.resolve(res.data || [])
    })
    .catch((error) => {
      console.log(error)
      return Promise.resolve([])
    })
}

async function getResult(keyword: string) {
  try {
    const list = await getProjects()
    const options = list.map((item: any) => {
      const { id, sourceName, sourceId, parentId } = item
      if (keyword && !sourceName.includes(keyword)) return null
      return {
        title: sourceName?.replace(/【|】/g, ""),
        subtitle: `更新时间：${formatTime(item.updateTime)}`,
        arg: `https://lanhuapp.com/web/#/item/project/stage?tid=${envs.TEAM_ID}&pid=${sourceId}`,
        variables: {
          id,
          sourceId,
          parentId
        },
        valid: true,
        autocomplete: sourceName,
        icon: './686836C6-47E0-4864-8BF3-06DD2C9B5D8F.png',
      }
    }).filter(Boolean)
    alfy.output(options)
  } catch (e: any) {
    console.log('Error: Unexpected error occurred: ', e.message)
      alfy.output([
        {
          title: `ERROR: ${e.message}`,
          subtitle: '检查环境变量是否填写完整',
          arg: '',
          icon: { path: alfy.icon.error },
        },
      ]);
  }
}

getResult(alfy.input)
