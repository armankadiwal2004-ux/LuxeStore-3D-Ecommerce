import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiSearch, HiShieldCheck, HiUser } from 'react-icons/hi'
import { dbListen, dbUpdate } from '../firebase/config'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const unsub = dbListen('users', (data) => {
      if (data) {
        setUsers(Object.entries(data).map(([id, v]) => ({ ...v, uid: id })))
      }
    })
    return unsub
  }, [])

  const filtered = users.filter(u =>
    (u.displayName || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleRoleToggle = async (uid, currentRole) => {
    const newRole = currentRole === 'admin' ? 'customer' : 'admin'
    if (!window.confirm(`Change role to ${newRole}?`)) return
    try {
      await dbUpdate(`users/${uid}`, { role: newRole })
      toast.success(`Role updated to ${newRole}`)
    } catch {
      toast.error('Failed to update role')
    }
  }

  const adminCount = users.filter(u => u.role === 'admin').length
  const customerCount = users.filter(u => u.role !== 'admin').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-white/40 text-sm mt-1">{users.length} total users</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-xs text-white/40">Total Users</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-2xl font-bold text-purple-400">{adminCount}</p>
          <p className="text-xs text-white/40">Admins</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-2xl font-bold text-blue-400">{customerCount}</p>
          <p className="text-xs text-white/40">Customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
        <HiSearch className="w-4 h-4 text-white/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="bg-transparent border-none outline-none text-sm flex-1 placeholder-white/30"
        />
      </div>

      {/* Users list */}
      <div className="space-y-2">
        {filtered.map((u, i) => (
          <motion.div
            key={u.uid}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-white/20 transition-all"
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              u.role === 'admin'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}>
              {u.displayName?.[0] || u.email?.[0]?.toUpperCase() || '?'}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{u.displayName || 'Anonymous'}</p>
                {u.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-semibold">
                    <HiShieldCheck className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-white/40 truncate">{u.email}</p>
            </div>

            {/* Joined date */}
            <div className="hidden sm:block text-right">
              <p className="text-xs text-white/30">Joined</p>
              <p className="text-xs text-white/50">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>

            {/* Role toggle */}
            <button
              onClick={() => handleRoleToggle(u.uid, u.role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                u.role === 'admin'
                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20'
                  : 'bg-white/5 text-white/50 border-white/10 hover:border-white/20'
              }`}
            >
              {u.role === 'admin' ? 'Admin' : 'Customer'}
            </button>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-white/30">
          <HiUser className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No users found</p>
        </div>
      )}
    </div>
  )
}
