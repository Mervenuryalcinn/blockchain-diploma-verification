import { create } from 'kubo-rpc-client'
import { createHash } from 'crypto'

export async function uploadDiploma(diplomaData) {
  const client = create({ url: 'http://127.0.0.1:5001' })

  const diplomaJSON = JSON.stringify(diplomaData)
  
  const result = await client.add(diplomaJSON)
  const cid = result.cid.toString()
  
  const hash = createHash('sha256')
    .update(diplomaJSON)
    .digest('hex')
  
  console.log('✅ IPFS\'e yüklendi!')
  console.log('📎 CID:', cid)
  console.log('🔐 Hash:', hash)
  
  return { cid, hash }
}