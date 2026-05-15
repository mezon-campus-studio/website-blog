'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Trash2, FolderPlus, Pencil } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/category/hooks/useCategories';
import { Category } from '@/features/category/types';

interface CategoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
}

export function CategoryFormDialog({ open, onClose, category }: CategoryFormDialogProps) {
  const isEdit = !!category;

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const isSaving = createCategory.isPending || updateCategory.isPending;
  const isDeleting = deleteCategory.isPending;

  // Portal cần document — chỉ available ở client
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '');
      setDescription(category?.description ?? '');
      setError('');
      setConfirmDelete(false);
      // Chặn scroll body khi dialog mở
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open, category]);

  if (!mounted || !open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Tên danh mục không được để trống.');
      return;
    }

    try {
      if (isEdit && category) {
        await updateCategory.mutateAsync({
          category_id: category.id,
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else {
        await createCategory.mutateAsync({
          name: name.trim(),
          description: description.trim() || undefined,
        });
      }
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    }
  }

  async function handleDelete() {
    if (!category) return;
    try {
      await deleteCategory.mutateAsync(category.id);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Xóa thất bại.');
    }
  }

  const dialog = (
    // Portal root — render thẳng vào document.body, thoát khỏi mọi stacking context
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999 }}
      className="flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)' }}
        className="backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        style={{ position: 'relative', zIndex: 10000, width: '100%', maxWidth: '32rem' }}
        className="animate-in fade-in slide-in-from-bottom-4 duration-300"
      >
        <Card className="border-none shadow-2xl bg-card-bg/30 backdrop-blur-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-card-border bg-card-bg/50">
            <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
              {isEdit
                ? <><Pencil size={16} className="text-primary" />Chỉnh sửa danh mục</>
                : <><FolderPlus size={16} className="text-primary" />Tạo danh mục mới</>
              }
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-card-bg rounded-full transition-colors text-muted-foreground"
            >
              <X size={16} />
            </button>
          </div>

          {/* Confirm delete */}
          {confirmDelete ? (
            <CardContent className="p-6 space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bạn có chắc muốn xóa danh mục{' '}
                <span className="font-bold text-foreground">"{category?.name}"</span>?
                <br />
                <span className="text-destructive text-xs">Hành động này không thể hoàn tác.</span>
              </p>
              {error && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
              )}
              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)} disabled={isDeleting}>
                  Quay lại
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  disabled={isDeleting}
                  className="gap-2 text-destructive border-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={14} />
                  {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Tên danh mục <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ví dụ: Công nghệ, Khoa học..."
                    disabled={isSaving}
                    className="w-full bg-card-bg/50 border border-card-border rounded-xl px-4 py-3
                               text-sm outline-none placeholder:text-muted-foreground/40
                               focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                               transition-all disabled:opacity-50"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Mô tả{' '}
                    <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">
                      (tuỳ chọn)
                    </span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả ngắn về nội dung danh mục này..."
                    rows={3}
                    disabled={isSaving}
                    className="w-full bg-card-bg/50 border border-card-border rounded-xl px-4 py-3
                               text-sm outline-none placeholder:text-muted-foreground/40
                               focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                               transition-all resize-none disabled:opacity-50"
                  />
                </div>

                {error && (
                  <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
                )}
              </CardContent>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-card-border bg-card-bg/50">
                {isEdit ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider
                               text-destructive hover:underline transition disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                    Xóa danh mục
                  </button>
                ) : <span />}

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                    Huỷ
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSaving}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    {!isSaving && (isEdit ? <Pencil size={14} /> : <FolderPlus size={14} />)}
                    {isSaving
                      ? isEdit ? 'Đang lưu...' : 'Đang tạo...'
                      : isEdit ? 'Lưu thay đổi' : 'Tạo danh mục'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );

  // Render vào document.body qua Portal — thoát khỏi mọi overflow/transform cha
  return createPortal(dialog, document.body);
}