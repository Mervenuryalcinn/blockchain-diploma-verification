import { uploadDiploma } from './upload.js'

const diploma = {
  studentName: "Ahmet Yılmaz",
  studentId: "20231234",
  university: "X Üniversitesi",
  department: "Yazılım Mühendisliği",
  degree: "Lisans",
  graduationDate: "2026-06-15",
  gpa: "3.05"
}

const result = await uploadDiploma(diploma)
console.log('Sonuç:', result)