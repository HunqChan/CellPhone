import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react'
import { productApi } from '../../api/productApi'
import { categoryApi } from '../../api/categoryApi'
import { attributeApi } from '../../api/attributeApi'
import ProductCard from '../../components/product/ProductCard'
import { PageSpinner } from '../../components/ui/Spinner'

const SORT_OPTIONS = [
  { value: 'id|desc', label: 'Mới nhất' },
  { value: 'id|asc', label: 'Cũ nhất' },
  { value: 'name|asc', label: 'Tên A-Z' },
  { value: 'name|desc', label: 'Tên Z-A' },
]

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [attributes, setAttributes] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 })
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null,
    brand: '',
    minPrice: '',
    maxPrice: '',
    attributeValueIds: [],
    sortBy: 'id',
    sortDir: 'desc',
    page: 0,
    size: 12,
  })

  useEffect(() => {
    categoryApi.getAll().then((r) => setCategories(r.data || []))
    attributeApi.getAll().then((r) => setAttributes(r.data || []))
  }, [])

  const fetchProducts = useCallback(async (f) => {
    setLoading(true)
    try {
      const payload = {
        search: f.search || undefined,
        categoryId: f.categoryId || undefined,
        brand: f.brand || undefined,
        minPrice: f.minPrice ? Number(f.minPrice) : undefined,
        maxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
        attributeValueIds: f.attributeValueIds.length ? f.attributeValueIds : undefined,
        page: f.page,
        size: f.size,
        sortBy: f.sortBy,
        sortDir: f.sortDir,
      }
      const res = await productApi.filter(payload)
      const paged = res.data
      setProducts(paged.content || [])
      setPagination({ page: paged.page, totalPages: paged.totalPages, totalElements: paged.totalElements })
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(filters)
  }, [filters, fetchProducts])

  const updateFilter = (key, value) =>
    setFilters((f) => ({ ...f, [key]: value, page: 0 }))

  const toggleAttributeValue = (id) => {
    setFilters((f) => {
      const existing = f.attributeValueIds
      const updated = existing.includes(id) ? existing.filter((x) => x !== id) : [...existing, id]
      return { ...f, attributeValueIds: updated, page: 0 }
    })
  }

  const resetFilters = () =>
    setFilters({
      search: '',
      categoryId: null,
      brand: '',
      minPrice: '',
      maxPrice: '',
      attributeValueIds: [],
      sortBy: 'id',
      sortDir: 'desc',
      page: 0,
      size: 12,
    })

  const handleSortChange = (val) => {
    const [sortBy, sortDir] = val.split('|')
    setFilters((f) => ({ ...f, sortBy, sortDir, page: 0 }))
  }

  const currentSort = `${filters.sortBy}|${filters.sortDir}`

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'flex-start' }}>

          {/* ── Filter Sidebar ── */}
          <aside className="filter-sidebar">
            <FilterPanel
              filters={filters}
              categories={categories}
              attributes={attributes}
              updateFilter={updateFilter}
              toggleAttributeValue={toggleAttributeValue}
              resetFilters={resetFilters}
            />
          </aside>

          {/* ── Main Content ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-md)',
                alignItems: 'center',
                marginBottom: 'var(--space-xl)',
                flexWrap: 'wrap',
              }}
            >
              {/* Search */}
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  id="product-search"
                  type="text"
                  className="form-input"
                  placeholder="Tìm kiếm sản phẩm..."
                  style={{ paddingLeft: 40 }}
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
                {filters.search && (
                  <button
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                    onClick={() => updateFilter('search', '')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <select
                className="form-select"
                style={{ width: 'auto', minWidth: 160 }}
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                id="sort-select"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Mobile filter toggle */}
              <button
                className="btn btn-secondary btn-sm"
                style={{ display: 'none' }}
                onClick={() => setShowMobileFilter(true)}
              >
                <SlidersHorizontal size={14} />
                Bộ lọc
              </button>

              {/* Results count */}
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                {pagination.totalElements} sản phẩm
              </span>
            </div>

            {/* Products */}
            {loading ? (
              <PageSpinner />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Search size={36} />
                </div>
                <p className="empty-state-title">Không tìm thấy sản phẩm</p>
                <p className="empty-state-desc">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button className="btn btn-outline btn-sm" onClick={resetFilters}>
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={pagination.page === 0}
                      onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                    >
                      ‹
                    </button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`page-btn ${i === pagination.page ? 'active' : ''}`}
                        onClick={() => setFilters((f) => ({ ...f, page: i }))}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="page-btn"
                      disabled={pagination.page >= pagination.totalPages - 1}
                      onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterPanel({ filters, categories, attributes, updateFilter, toggleAttributeValue, resetFilters }) {
  return (
    <div>
      {/* Active filters indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Bộ lọc</h3>
        <button
          onClick={resetFilters}
          style={{ fontSize: '0.75rem', color: 'var(--text-accent)', fontWeight: 500 }}
        >
          Xóa tất cả
        </button>
      </div>

      {/* Category */}
      <div className="filter-section">
        <p className="filter-section-title">Danh mục</p>
        <label className="filter-option">
          <input
            type="radio"
            name="category"
            checked={!filters.categoryId}
            onChange={() => updateFilter('categoryId', null)}
          />
          Tất cả
        </label>
        {categories.map((cat) => (
          <label key={cat.id} className="filter-option">
            <input
              type="radio"
              name="category"
              checked={filters.categoryId === cat.id}
              onChange={() => updateFilter('categoryId', cat.id)}
            />
            {cat.name}
          </label>
        ))}
      </div>

      {/* Price range */}
      <div className="filter-section">
        <p className="filter-section-title">Khoảng giá (VND)</p>
        <div className="price-range">
          <input
            type="number"
            className="form-input"
            placeholder="Từ"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            id="min-price"
          />
          <span style={{ color: 'var(--text-muted)' }}>—</span>
          <input
            type="number"
            className="form-input"
            placeholder="Đến"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            id="max-price"
          />
        </div>
        {/* Quick price presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
          {[
            { label: 'Dưới 5 triệu', min: '', max: '5000000' },
            { label: '5 – 15 triệu', min: '5000000', max: '15000000' },
            { label: '15 – 30 triệu', min: '15000000', max: '30000000' },
            { label: 'Trên 30 triệu', min: '30000000', max: '' },
          ].map((p) => (
            <button
              key={p.label}
              className="filter-option"
              style={{ justifyContent: 'flex-start', padding: '6px 0' }}
              onClick={() => {
                updateFilter('minPrice', p.min)
                updateFilter('maxPrice', p.max)
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Attributes */}
      {attributes.map((attr) => (
        <div key={attr.id} className="filter-section">
          <p className="filter-section-title">{attr.name}</p>
          {(attr.values || []).map((val) => (
            <label key={val.id} className="filter-option">
              <input
                type="checkbox"
                checked={filters.attributeValueIds.includes(val.id)}
                onChange={() => toggleAttributeValue(val.id)}
              />
              {val.value}
            </label>
          ))}
        </div>
      ))}
    </div>
  )
}
