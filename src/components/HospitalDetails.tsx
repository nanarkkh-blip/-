/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Clock, MapPin, HeartPulse, ShieldCheck } from 'lucide-react';

export default function HospitalDetails() {
  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-100/80 rounded-2xl p-5 mb-6" id="hospital-info-box">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              ມາດຕະຖານສຸຂະອະນາໄມ 100%
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
              <HeartPulse className="w-3.5 h-3.5" />
              ອາຫານເພື່ອສຸຂະພາບ
            </span>
          </div>
          
          <h2 className="text-lg font-bold text-slate-800 mb-1" id="hospital-info-title">
            ຮ້ານອາຫານ ອາລີຢາ 
          </h2>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed max-w-xl">
            ບໍລິການອາຫານສົດໃໝ່, ສະອາດ, ປຸງແຕ່ງຖືກຫຼັກໂພຊະນາການ. ຫຼຸດຄວາມເຄັມ ແລະ ໄຂມັນ ເພື່ອສຸຂະພາບທີ່ດີຂອງຄົນປ່ວຍ, ຍາດຕິພີ່ນ້ອງ ແລະ ພະນັກງານແພດໝໍ.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:self-stretch items-stretch md:items-center">
          <div className="flex items-center gap-3 bg-white/9w-full sm:w-auto border border-slate-100 rounded-xl p-3 shadow-xs">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ໂມງເປີດບໍລິການ</p>
              <p className="text-xs font-bold text-slate-700">07:00 - 21:00 ໂມງ</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/90 border border-slate-100 rounded-xl p-3 shadow-xs">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">ສະຖານທີ່ຕັ້ງ</p>
              <p className="text-xs font-bold text-slate-700">ໂຮງໝໍແຂວງສາລະວັນ, (ຂ້າງທາດອົງແກ້ວ)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
