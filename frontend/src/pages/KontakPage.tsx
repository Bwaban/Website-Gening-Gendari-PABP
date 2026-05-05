import { Mail, MapPin, Phone } from 'lucide-react'
import AccordionItem from '../components/marketing/AccordionItem'
import InfoTile from '../components/marketing/InfoTile'
import PageHero from '../components/marketing/PageHero'
import Card from '../components/ui/Card'

export default function KontakPage() {
  return (
    <div className="page-shell bg-cream">
      <PageHero
        badge="✨ Hubungi Kami"
        title={
          <>
            Ada Pertanyaan?
            <br />
            Kami Siap Membantu
          </>
        }
        description="Tim kami siap menjawab pertanyaan dan membantu Anda dalam setiap langkah."
        variant="pink"
      />

      <section className="py-12 sm:py-16">
        <div className="container-page">
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            <InfoTile icon={Mail} title="Email" content="Email@Email.com" />
            <InfoTile icon={Phone} title="Telepon" content="+62 812 1234 5678" />
            <InfoTile icon={MapPin} title="Alamat" content="Jl. Kebanggan no 123, Jakarta 12345" />
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-6 lg:grid-cols-2">
            <Card className="p-7 flex flex-col min-h-[400px]">
              <h2 className="font-display text-4xl font-bold text-dark">Peta Lokasi</h2>
              <div className="mt-3 h-px w-full bg-gradient-to-r from-saffron to-transparent" />
              <div className="mt-6 flex-grow rounded-[10px] overflow-hidden border border-[#e1caa9]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24036665798!2d106.74936991953123!3d-6.2297401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1714828131343!5m2!1sid!2sid" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '300px' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </Card>

            <Card className="space-y-8 p-7">
              <div>
                <h2 className="font-display text-4xl font-bold text-dark">Jam Operasional</h2>
                <div className="mt-3 h-px w-full bg-gradient-to-r from-saffron to-transparent" />
                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex items-center justify-between border-b border-[#efe1cb] pb-3">
                    <span className="text-dark/72">Senin - Jumat</span>
                    <span className="font-semibold text-dark">09:00 - 17:00 WIB</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#efe1cb] pb-3">
                    <span className="text-dark/72">Sabtu</span>
                    <span className="font-semibold text-dark">09:00 - 15:00 WIB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-dark/72">Minggu & Libur</span>
                    <span className="font-semibold text-cultureRed">Tutup</span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-display text-4xl font-bold text-dark">Lokasi Kantor Kami</h2>
                <div className="mt-3 h-px w-full bg-gradient-to-r from-saffron to-transparent" />
                <div className="mt-6 rounded-[10px] border border-dashed border-[#e1caa9] bg-cream px-6 py-12 text-center">
                  <div className="text-xl">📍</div>
                  <div className="mt-4 text-dark/70">Jl. Kebanggan no 123</div>
                  <div className="mt-1 text-dark/70">Jakarta 12345, Indonesia</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            <div className="text-center">
              <p className="soft-label">FAQ</p>
              <h2 className="section-title mt-3">Pertanyaan Umum</h2>
              <p className="section-copy mx-auto mt-3">
                Temukan jawaban dari pertanyaan yang sering ditanyakan.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <AccordionItem
                question="Apa itu Gending Gandari?"
                answer="Gending Gandari adalah salah satu bentuk komposisi karawitan tradisional Sunda yang memiliki struktur melodi khas dan nilai budaya yang kuat."
                defaultOpen
              />
              <AccordionItem
                question="Bagaimana cara membeli tiket pertunjukan?"
                answer="Anda bisa memilih acara dari halaman beranda atau daftar event, lalu masuk ke halaman detail untuk melanjutkan proses pemesanan tiket. Pembayaran dapat dilakukan melalui transfer atau dompet digital."
              />
              <AccordionItem
                question="Apakah bisa mendaftarkan pertunjukan seni saya?"
                answer="Sangat bisa! Kami selalu terbuka bagi komunitas, sanggar, dan penyelenggara acara seni tradisional di seluruh Indonesia untuk berkolaborasi dan berkembang bersama."
              />
              <AccordionItem
                question="Apakah tiket bisa di-refund jika acara dibatalkan?"
                answer="Tentu. Jika acara batal dari pihak penyelenggara, kami akan membantu proses refund dana Anda 100% atau mereschedule tiket sesuai kebijakan event yang telah disetujui."
              />
              <AccordionItem
                question="Apakah saya perlu mencetak e-tiket saya?"
                answer="Tidak perlu. Anda cukup menunjukkan kode QR e-tiket dari ponsel Anda di pintu masuk tempat pertunjukan berlangsung. Pengalaman digital yang praktis dan ramah lingkungan."
              />
              <AccordionItem
                question="Bagaimana jika saya ingin menjalin sponsorship?"
                answer="Untuk keperluan kemitraan komersial, promosi skala besar, atau sponsorship program, Anda dapat menghubungi kami langsung melalui alamat email yang tertera di bagian atas. Tim kemitraan kami akan segera membalasnya."
              />
              <AccordionItem
                question="Apakah tersedia kategori harga tiket bagi pelajar?"
                answer="Kebijakan harga pelajar tergantung pada masing-masing penyelenggara pertunjukan. Jika tersedia promosi atau harga khusus, informasi tersebut akan dilampirkan pada halaman detail acara."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
