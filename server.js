// server.js  (proje kökünde)
process.env.HOSTNAME = "0.0.0.0";             // Passenger/Node için güvenli
process.env.PORT = process.env.PORT || "3000";

require("./.next/standalone/server.js");      // Next standalone server'ı başlat
