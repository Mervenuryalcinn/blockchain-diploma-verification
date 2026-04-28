import { create } from 'kubo-rpc-client'
import { readFileSync } from 'fs'
import { createHash } from 'crypto'

async function uploadDiploma() {
  const client = create({ url: 'http://127.0.0.1:5001' })

  const diplomaJSON = readFileSync('./diploma.json', 'utf8')
  
  const result = await client.add(diplomaJSON)
  const cid = result.cid.toString()
  
  console.log('✅ IPFS\'e yüklendi!')
  console.log('📎 CID:', cid)

  const hash = createHash('sha256')
    .update(diplomaJSON)
    .digest('hex')
  
  console.log('🔐 Hash:', hash)
  
  return { cid, hash }
}

uploadDiploma().catch(console.error)