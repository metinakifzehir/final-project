// Veritabani ve uygulama kullanicisi olusturulur.
// Koleksiyonlar ve veriler manuel veya import scriptleri ile eklenecek.

db = db.getSiblingDB("restoran_oneri");

db.createUser({
  user: "app_user",
  pwd: "app_password",
  roles: [{ role: "readWrite", db: "restoran_oneri" }],
});

print("MongoDB init: restoran_oneri veritabani ve app_user kullanicisi hazir.");
