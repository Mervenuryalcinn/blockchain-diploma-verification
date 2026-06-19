# 🎓 Merkeziyetsiz Diploma Doğrulama Sistemi (Decentralized Diploma Verification)

Bu proje, üniversite diplomalarının değiştirilmesini ve sahteciliğini önlemek amacıyla **Ethereum Blok Zinciri** ve **IPFS (InterPlanetary File System)** kullanılarak geliştirilmiş güvenli bir doğrulama sistemidir. Diplomalar merkezi bir veritabanı yerine IPFS üzerinde merkeziyetsiz olarak saklanır ve içerik bütünlüğü (hash) akıllı kontratlar aracılığıyla blok zincirde güvence altına alınır.

---

## ❓ Biz Ne Yapıyoruz?

Sistemimizde bir üniversite diploma bilgilerini oluşturur, bu diploma bilgisi IPFS’e yüklenir ve diplomanın hash değeri Ethereum blok zincirine kaydedilir. Daha sonra biri (örneğin bir işveren) diplomayı doğrulamak istediğinde, elindeki diploma verisinin hash’i tekrar hesaplanır ve blok zincirde kayıtlı hash ile karşılaştırılır.

## 🛡️ Sistem Ne İşe Yarıyor?

Normalde bir diploma PDF veya JSON dosyası üzerinde yetkisiz değişiklikler yapılabilir. Mesela:
`"gpa": "3.05"` değeri kolayca `"gpa": "3.95"` olarak değiştirilebilir.

Bu sistem bunu yakalamaya çalışır. Çünkü diploma verisinin hash’i (dijital parmak izi) değişirse, blok zincirdeki orijinal hash ile uyuşmaz. Böylece sistem anında şu kararı verir:
* **Hash aynıysa:** Diploma geçerlidir.
* **Hash farklıysa:** Diploma sahte veya değiştirilmiştir.

---

## 👥 Sistemde Kimler Var?

### 1. Üniversite (Oluşturan)
Diplomayı oluşturan taraftır. Şunları yapar:
* Öğrenci diploma verisini JSON olarak oluşturur.
* Bu JSON’u IPFS’e yükler ve IPFS’ten bir CID (İçerik Kimliği) alır.
* JSON dosyasının hash’ini hesaplar.
* CID + Hash değerini Ethereum akıllı kontratına kaydeder.

### 2. Öğrenci (Sahip)
Diplomasını paylaşan kişidir. Doğrulama için şunları paylaşabilir:
* Diploma JSON verisi
* IPFS CID değeri
* Öğrenci numarası veya diploma ID gibi bilgiler

### 3. Doğrulayıcı (Kontrol Eden)
Diplomanın gerçek olup olmadığını kontrol eden kişidir (örn. işveren). Şunları yapar:
* Diploma JSON verisini sisteme girer.
* Sistem hash’i hesaplar ve blok zincirdeki kayıtlı hash ile karşılaştırır.
* Sonuca göre geçerli veya sahte olduğunu teyit eder.

---

## 📦 Kullanılacak Veri Modeli

Diploma bilgisi standart bir JSON formatında IPFS'e yüklenecek ve hash'i alınacaktır:

```json
{
  "studentName": "Ahmet Yılmaz",
  "studentId": "20231234",
  "university": "X Üniversitesi",
  "department": "Yazılım Mühendisliği",
  "degree": "Lisans",
  "graduationDate": "2026-06-15",
  "gpa": "3.05"
}
##
## 🏗️ Projenin Ana Parçaları

### 1. Smart Contract (Akıllı Kontrat)
Ethereum tarafında çalışan Solidity kodudur. 
* **Görevleri:** Diploma kaydı oluşturmak, doğrulamak ve gerektiğinde iptal etmektir.
* **Örnek Veri Yapısı:**

```solidity
struct Diploma {
    string studentId;    // Öğrencinin numarası
    string cid;          // IPFS'ten gelen dosya adresi (örn. QmX...abc)
    bytes32 dataHash;    // JSON verisinin hash'i
    bool isRevoked;      // Diploma iptal edildi mi?
}
### 2. IPFS Katmanı
Diploma JSON dosyasını merkezi olmayan şekilde saklamak için kullanılır. Diploma hazırlandıktan sonra IPFS'e yüklenir ve IPFS bize bir CID verir. Bu CID ile veri her zaman tekrar bulunabilir.

### 3. Backend (Arka Plan)
Node.js ve Express.js ile geliştirilen sistemin köprü katmanıdır. İki temel API uç noktasına sahiptir:

* POST /issueDiploma: Diploma oluşturur. (JSON'u IPFS'e yükler, hash hesaplar, smart contract'ı çağırır).

* POST /verifyDiploma: Diplomayı doğrular. (Gelen JSON'un hash'ini hesaplar ve kontrattaki ile karşılaştırır).

### 4. Frontend (Kullanıcı Arayüzü)
Kullanıcının gördüğü iki temel ekrandan oluşur:

* **Diploma Oluşturma Ekranı:** Üniversitenin öğrenci bilgilerini (Ad, No, Bölüm, GPA vb.) girdiği ve "Diploma Oluştur" dediği form.

* **Diploma Doğrulama Ekranı:** JSON verisinin girilip "Doğrula" butonuna basıldığı ve "Geçerli", "Sahte" veya "İptal Edilmiş" sonucunun gösterildiği ekran.
### 🔄 Genel Akış
Diploma Oluşturma
* Üniversite diploma bilgilerini forma girer.

* Frontend bu bilgileri backend’e gönderir.

* Backend JSON oluşturur ve IPFS’e yükleyerek CID üretir.

* Backend JSON hash’ini hesaplar.

* Backend smart contract’a CID + hash kaydeder.

* Kullanıcıya diploma ID / CID / doğrulama bilgisi
Diploma Doğrulama
* 1.Doğrulayıcı diploma JSON’unu sisteme girer.

* 2.Backend bu JSON’un hash’ini tekrar hesaplar.

* 3.Smart contract’tan kayıtlı hash alınır.

* 4.İki hash karşılaştırılır ve sonuç ekranda gösterilir.
