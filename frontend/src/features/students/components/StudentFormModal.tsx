import React, { useEffect, useState } from 'react';
import { StudentDTO, StudentInputDTO } from '../../../types/student';
import { X, Save, Loader2, AlertCircle } from 'lucide-react';

interface StudentFormModalProps {
  isOpen: boolean;
  initialData?: StudentDTO | null;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: StudentInputDTO) => Promise<void>;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  isOpen,
  initialData,
  isLoading = false,
  onClose,
  onSubmit,
}) => {
  const isEdit = !!initialData;
  const [sbd, setSbd] = useState('');
  const [stream, setStream] = useState<'NATURAL' | 'SOCIAL'>('NATURAL');
  const [maNgoaiNgu, setMaNgoaiNgu] = useState('N1');

  const [toan, setToan] = useState<string>('0');
  const [nguVan, setNguVan] = useState<string>('0');
  const [ngoaiNgu, setNgoaiNgu] = useState<string>('0');

  // Natural
  const [vatLi, setVatLi] = useState<string>('0');
  const [hoaHoc, setHoaHoc] = useState<string>('0');
  const [sinhHoc, setSinhHoc] = useState<string>('0');

  // Social
  const [lichSu, setLichSu] = useState<string>('0');
  const [diaLi, setDiaLi] = useState<string>('0');
  const [gdcd, setGdcd] = useState<string>('0');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setSbd(initialData.sbd);
      setStream(initialData.group);
      setMaNgoaiNgu(initialData.maNgoaiNgu || 'N1');

      setToan(String(initialData.scores.toan ?? 0));
      setNguVan(String(initialData.scores.nguVan ?? 0));
      setNgoaiNgu(String(initialData.scores.ngoaiNgu ?? 0));

      setVatLi(String(initialData.scores.vatLi ?? 0));
      setHoaHoc(String(initialData.scores.hoaHoc ?? 0));
      setSinhHoc(String(initialData.scores.sinhHoc ?? 0));

      setLichSu(String(initialData.scores.lichSu ?? 0));
      setDiaLi(String(initialData.scores.diaLi ?? 0));
      setGdcd(String(initialData.scores.gdcd ?? 0));
    } else {
      setSbd('');
      setStream('NATURAL');
      setMaNgoaiNgu('N1');
      setToan('0');
      setNguVan('0');
      setNgoaiNgu('0');
      setVatLi('0');
      setHoaHoc('0');
      setSinhHoc('0');
      setLichSu('0');
      setDiaLi('0');
      setGdcd('0');
    }
    setErrorMsg(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!sbd || !/^\d{6,10}$/.test(sbd.trim())) {
      setErrorMsg('Số báo danh (SBD) phải từ 6 đến 10 chữ số hợp lệ.');
      return;
    }

    const parseVal = (str: string) => {
      const num = parseFloat(str);
      if (isNaN(num) || num < 0 || num > 10) return 0.0;
      return Math.round(num * 100) / 100;
    };

    const payload: StudentInputDTO = {
      sbd: sbd.trim(),
      toan: parseVal(toan),
      nguVan: parseVal(nguVan),
      ngoaiNgu: parseVal(ngoaiNgu),
      maNgoaiNgu,
    };

    if (stream === 'NATURAL') {
      payload.vatLi = parseVal(vatLi);
      payload.hoaHoc = parseVal(hoaHoc);
      payload.sinhHoc = parseVal(sinhHoc);
    } else {
      payload.lichSu = parseVal(lichSu);
      payload.diaLi = parseVal(diaLi);
      payload.gdcd = parseVal(gdcd);
    }

    try {
      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi lưu thông tin thí sinh.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            {isEdit ? `Chỉnh Sửa Thí Sinh SBD: ${sbd}` : 'Thêm Thí Sinh Mới'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SBD & Stream Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số Báo Danh (SBD) *</label>
              <input
                type="text"
                disabled={isEdit}
                value={sbd}
                onChange={(e) => setSbd(e.target.value)}
                placeholder="VD: 01000001"
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[var(--color-primary)] disabled:bg-slate-100 disabled:text-slate-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Ngoại Ngữ</label>
              <select
                value={maNgoaiNgu}
                onChange={(e) => setMaNgoaiNgu(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="N1">N1 (Tiếng Anh)</option>
                <option value="N2">N2 (Tiếng Nga)</option>
                <option value="N3">N3 (Tiếng Pháp)</option>
                <option value="N4">N4 (Tiếng Trung)</option>
                <option value="N5">N5 (Tiếng Đức)</option>
                <option value="N6">N6 (Tiếng Nhật)</option>
                <option value="N7">N7 (Tiếng Hàn)</option>
              </select>
            </div>
          </div>

          {!isEdit && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Chọn Nhóm Môn Thi *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStream('NATURAL')}
                  className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                    stream === 'NATURAL'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Khối Tự Nhiên (Lý, Hóa, Sinh)
                </button>
                <button
                  type="button"
                  onClick={() => setStream('SOCIAL')}
                  className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                    stream === 'SOCIAL'
                      ? 'bg-purple-50 border-purple-300 text-purple-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Khối Xã Hội (Sử, Địa, GDCD)
                </button>
              </div>
            </div>
          )}

          {/* Mandatory Subjects */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Các Môn Bắt Buộc</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Toán</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="10"
                  value={toan}
                  onChange={(e) => setToan(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Ngữ Văn</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="10"
                  value={nguVan}
                  onChange={(e) => setNguVan(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Ngoại Ngữ</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="10"
                  value={ngoaiNgu}
                  onChange={(e) => setNgoaiNgu(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Stream Specific Subjects */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Các Môn {stream === 'NATURAL' ? 'Tự Nhiên' : 'Xã Hội'}
            </h4>
            {stream === 'NATURAL' ? (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Vật Lý</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={vatLi}
                    onChange={(e) => setVatLi(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Hóa Học</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={hoaHoc}
                    onChange={(e) => setHoaHoc(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Sinh Học</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={sinhHoc}
                    onChange={(e) => setSinhHoc(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Lịch Sử</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={lichSu}
                    onChange={(e) => setLichSu(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Địa Lý</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={diaLi}
                    onChange={(e) => setDiaLi(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">GDCD</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="10"
                    value={gdcd}
                    onChange={(e) => setGdcd(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isEdit ? 'Cập Nhật' : 'Lưu Thí Sinh'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
