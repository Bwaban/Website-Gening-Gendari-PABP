import { useState } from 'react'
import { User, Mail, Shield, Save, Edit3 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

export default function ProfilPage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // State sinkron dengan user?.nama jika ada, fallback kosong.
  const [formData, setFormData] = useState({
    nama: user?.nama || '',
    email: user?.email || '', // Email biasanya readonly
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    // MOCKUP API CALL (Simulasi penyimpanan)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)) // delay pura-pura
      setMessage('Profil berhasil diperbarui!')
      
      // Jika butuh memanggil API: 
      // await apiRequest('/users/profil', { method: 'PUT', body: JSON.stringify(formData) })

      setIsEditing(false)
    } catch (error) {
      setMessage('Gagal memperbarui profil.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell bg-cream/30 py-12 sm:py-20">
      <div className="container-page max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-dark sm:text-5xl">Profil Akun</h1>
            <p className="mt-2 text-dark/72">Kelola informasi pribadi dan data profil Anda di sini.</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Profil
            </Button>
          )}
        </div>

        {message && (
          <div className="mb-6 rounded-[10px] border border-cultureGreen/20 bg-cultureGreen/10 px-4 py-3 text-sm text-cultureGreen">
            {message}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          {/* Bagian Info Profil Statis (Kiri) */}
          <Card className="col-span-1 flex flex-col items-center p-8 text-center h-fit">
            <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-soft">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.nama || 'User'}&backgroundColor=C88A2A&textColor=ffffff`}
                alt="Profile Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="font-display text-2xl font-bold text-dark">{formData.nama || 'Pengguna'}</h2>
            <p className="mt-1 text-sm font-medium text-gold">{user?.role === 'admin' ? 'Administrator' : 'Pengguna Standar'}</p>
          </Card>

          {/* Form Edit Profil (Kanan) */}
          <Card className="col-span-1 md:col-span-2 p-8">
            <h3 className="mb-6 font-display text-2xl font-bold text-dark border-b border-saffron/15 pb-4">
              Informasi Pribadi
            </h3>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    label="Nama Lengkap"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap Anda"
                    required
                  />
                </div>
                
                <div>
                  <Input
                    label="Alamat Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-dark/5 opacity-70"
                    title="Alamat email tidak dapat diubah"
                  />
                  <p className="mt-2 text-xs text-dark/50">Email digunakan untuk login dan tidak dapat diubah.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                    Batal
                  </Button>
                  <Button type="submit" loading={loading} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-dark/60 mb-1">
                    <User className="h-4 w-4" /> Nama Lengkap
                  </div>
                  <div className="text-lg font-medium text-dark">{formData.nama || '-'}</div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-dark/60 mb-1">
                    <Mail className="h-4 w-4" /> Alamat Email
                  </div>
                  <div className="text-lg font-medium text-dark">{formData.email || '-'}</div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-dark/60 mb-1">
                    <Shield className="h-4 w-4" /> Status Akun
                  </div>
                  <div className="inline-flex items-center rounded-full bg-cultureGreen/10 px-3 py-1 text-sm font-semibold text-cultureGreen mt-1">
                    Aktif
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
