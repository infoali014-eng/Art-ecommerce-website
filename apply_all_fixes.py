import os
import re

# 1. Update database.ts
f = r'frontend/types/database.ts'
if os.path.exists(f):
    c = open(f, 'r', encoding='utf-8').read()
    if '[key: string]:' not in c:
        c = c.replace('Tables: {', 'Tables: {\n      [key: string]: { Row: any; Insert: any; Update: any };')
        open(f, 'w', encoding='utf-8').write(c)
        print("Database updated!")

# 2. Fix commissions page import
f = r'frontend/app/admin/commissions/page.tsx'
if os.path.exists(f):
    c = open(f, 'r', encoding='utf-8').read()
    if 'Eye' not in c:
        c = c.replace("Filter } from 'lucide-react'", "Filter, Eye } from 'lucide-react'")
        open(f, 'w', encoding='utf-8').write(c)
        print("Commissions updated!")

# 3. Fix settings page LoadingButton
f = r'frontend/app/admin/settings/page.tsx'
if os.path.exists(f):
    c = open(f, 'r', encoding='utf-8').read()
    if 'icon={Save}' in c:
        c = c.replace('icon={Save}', '').replace('Save Configurations', '{!saveLoading && <Save className="w-4 h-4 mr-2 inline-block" />}Save Configurations')
        open(f, 'w', encoding='utf-8').write(c)
        print("Settings updated!")

# 4. Fix createNotification return type
f = r'frontend/repositories/admin.repository.ts'
if os.path.exists(f):
    c = open(f, 'r', encoding='utf-8').read()
    c = re.sub(r'async\s+createNotification\([^)]*\)\s*\{([^}]*)\}', 'async createNotification(userId: string, title: string, message: string, type: string) {\n    const { error } = await supabase.from("notifications").insert({ user_id: userId, title, message, type, is_read: false });\n    return { error };\n  }', c)
    open(f, 'w', encoding='utf-8').write(c)
    print("Repository updated!")

# 5. Fix next.config.ts eslint key
f = r'frontend/next.config.ts'
if os.path.exists(f):
    c = open(f, 'r', encoding='utf-8').read()
    c = re.sub(r'eslint:\s*\{[^}]*\},?', '', c)
    open(f, 'w', encoding='utf-8').write(c)
    print("Config updated!")
