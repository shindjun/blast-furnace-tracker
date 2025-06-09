
import React, { useState } from "react";
import { saveAs } from "file-saver";

const TimeSlotRow = ({ index, data, onChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(index, { ...data, [name]: parseFloat(value) || 0 });
  };

  const ironInput = data.ore * data.feRate / 100;
  const expectedOutput = ironInput * data.recoveryRate / 100;
  const cokeRate = expectedOutput > 0 ? data.coke / expectedOutput : 0;

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
      <input name="ore" value={data.ore} onChange={handleInputChange} placeholder="철광석(ton)" />
      <input name="feRate" value={data.feRate} onChange={handleInputChange} placeholder="Fe(%)" />
      <input name="recoveryRate" value={data.recoveryRate} onChange={handleInputChange} placeholder="환원율(%)" />
      <input name="coke" value={data.coke} onChange={handleInputChange} placeholder="코크스(kg)" />
      <span>출선량: {expectedOutput.toFixed(1)}</span>
      <span>코크스비: {cokeRate.toFixed(1)}</span>
    </div>
  );
};

export default function App() {
  const [slots, setSlots] = useState(
    Array.from({ length: 6 }, () => ({ ore: 0, feRate: 0, recoveryRate: 0, coke: 0 }))
  );

  const handleSlotChange = (index, newData) => {
    const updated = [...slots];
    updated[index] = newData;
    setSlots(updated);
  };

  const exportToCSV = () => {
    const header = ["시간대", "철광석(ton)", "Fe(%)", "환원율(%)", "코크스(kg)", "예상 출선량(ton)", "출선당 코크스비(kg/ton)"];
    const rows = slots.map((slot, idx) => {
      const ironInput = slot.ore * slot.feRate / 100;
      const expected = ironInput * slot.recoveryRate / 100;
      const cokeRate = expected > 0 ? slot.coke / expected : 0;
      return [
        `시간대 ${idx + 1}`,
        slot.ore,
        slot.feRate,
        slot.recoveryRate,
        slot.coke,
        expected.toFixed(1),
        cokeRate.toFixed(1)
      ];
    });
    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "노황관리_시간대별_데이터.csv");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>고로 시간대별 노황관리 계산기</h2>
      {slots.map((slot, index) => (
        <TimeSlotRow key={index} index={index} data={slot} onChange={handleSlotChange} />
      ))}
      <button onClick={exportToCSV}>CSV 다운로드</button>
    </div>
  );
}
