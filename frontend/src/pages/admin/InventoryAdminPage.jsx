import { useState } from 'react'
import { Package, ArrowDown, ArrowUp } from 'lucide-react'
import { inventoryApi } from '../../api/inventoryApi'
import { toast } from '../../store/toastStore'
import { formatCurrency } from '../../utils/formatters'

export default function InventoryAdminPage() {
  const [importForm, setImportForm] = useState({ productVariantId: '', quantity: '' })
  const [exportForm, setExportForm] = useState({ productVariantId: '', quantity: '' })
  const [importResult, setImportResult] = useState(null)
  const [exportResult, setExportResult] = useState(null)
  const [loadingImport, setLoadingImport] = useState(false)
  const [loadingExport, setLoadingExport] = useState(false)

  const handleImport = async () => {
    if (!importForm.productVariantId || !importForm.quantity) {
      toast.warning('Vui lòng nhập ID biến thể và số lượng')
      return
    }
    setLoadingImport(true)
    try {
      const res = await inventoryApi.importStock({
        productVariantId: Number(importForm.productVariantId),
        quantity: Number(importForm.quantity),
      })
      setImportResult(res.data)
      toast.success('Nhập kho thành công!')
      setImportForm({ productVariantId: '', quantity: '' })
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoadingImport(false)
    }
  }

  const handleExport = async () => {
    if (!exportForm.productVariantId || !exportForm.quantity) {
      toast.warning('Vui lòng nhập ID biến thể và số lượng')
      return
    }
    setLoadingExport(true)
    try {
      const res = await inventoryApi.exportStock({
        productVariantId: Number(exportForm.productVariantId),
        quantity: Number(exportForm.quantity),
      })
      setExportResult(res.data)
      toast.success('Xuất kho thành công!')
      setExportForm({ productVariantId: '', quantity: '' })
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoadingExport(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Quản lý kho hàng</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Nhập / xuất kho theo biến thể sản phẩm
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
        {/* Import */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-xl)' }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: 'rgba(16,185,129,0.15)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowDown size={20} color="var(--success)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Nhập kho</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cộng thêm vào tồn kho</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="import-variant">ID Biến thể sản phẩm</label>
              <input
                id="import-variant"
                type="number"
                className="form-input"
                placeholder="Nhập ID variant..."
                value={importForm.productVariantId}
                onChange={(e) => setImportForm(f => ({ ...f, productVariantId: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="import-qty">Số lượng nhập</label>
              <input
                id="import-qty"
                type="number"
                className="form-input"
                placeholder="50"
                min={1}
                value={importForm.quantity}
                onChange={(e) => setImportForm(f => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <button
              className="btn btn-success"
              style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--success)', border: '1px solid rgba(16,185,129,0.3)' }}
              onClick={handleImport}
              disabled={loadingImport}
              id="import-stock-btn"
            >
              <ArrowDown size={16} />
              {loadingImport ? 'Đang nhập...' : 'Nhập kho'}
            </button>

            {importResult && (
              <div
                style={{
                  padding: 'var(--space-md)',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)' }}>
                  ✅ Nhập kho thành công!
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  Variant #{importResult.id} – Tồn kho: <strong>{importResult.quantityInStock}</strong> | Giá: {formatCurrency(importResult.price)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Export */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--bg-glass-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-xl)' }}>
            <div
              style={{
                width: 44,
                height: 44,
                background: 'rgba(239,68,68,0.15)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowUp size={20} color="var(--error)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Xuất kho</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Trừ tồn kho (kiểm kê, điều chỉnh)</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="export-variant">ID Biến thể sản phẩm</label>
              <input
                id="export-variant"
                type="number"
                className="form-input"
                placeholder="Nhập ID variant..."
                value={exportForm.productVariantId}
                onChange={(e) => setExportForm(f => ({ ...f, productVariantId: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="export-qty">Số lượng xuất</label>
              <input
                id="export-qty"
                type="number"
                className="form-input"
                placeholder="5"
                min={1}
                value={exportForm.quantity}
                onChange={(e) => setExportForm(f => ({ ...f, quantity: e.target.value }))}
              />
            </div>
            <button
              className="btn btn-danger"
              onClick={handleExport}
              disabled={loadingExport}
              id="export-stock-btn"
            >
              <ArrowUp size={16} />
              {loadingExport ? 'Đang xuất...' : 'Xuất kho'}
            </button>

            {exportResult && (
              <div
                style={{
                  padding: 'var(--space-md)',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--error)' }}>
                  ✅ Xuất kho thành công!
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                  Variant #{exportResult.id} – Tồn kho còn: <strong>{exportResult.quantityInStock}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note */}
      <div
        style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-lg)',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 'var(--radius-lg)',
        }}
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--warning)', fontWeight: 600, marginBottom: 8 }}>
          ⚠️ Lưu ý
        </p>
        <ul style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 16 }}>
          <li>Nhập kho: Cộng thêm số lượng vào tồn kho hiện tại</li>
          <li>Xuất kho: Trừ số lượng (dùng khi kiểm kê thực tế ít hơn hệ thống)</li>
          <li>Khi khách đặt hàng, hệ thống tự động trừ kho</li>
          <li>Khi hủy đơn, hệ thống tự động hoàn kho</li>
        </ul>
      </div>
    </div>
  )
}
