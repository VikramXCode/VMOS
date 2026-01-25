import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar, Clock, Gamepad2, User, Phone, CreditCard, CheckCircle2, Home } from 'lucide-react';

// Console/PC types with hourly pricing
const CONSOLE_TYPES = [
  { id: 'ps5', name: 'PlayStation 5', price: 100, icon: '🎮' },
  { id: 'ps4', name: 'PlayStation 4', price: 80, icon: '🎮' },
  { id: 'xbox', name: 'Xbox Series X', price: 100, icon: '🎮' },
  { id: 'pc-high', name: 'High-End PC', price: 80, icon: '💻' },
  { id: 'pc-mid', name: 'Mid-Range PC', price: 60, icon: '💻' },
  { id: 'switch', name: 'Nintendo Switch', price: 60, icon: '🕹️' },
  { id: 'vr', name: 'VR Gaming', price: 150, icon: '🥽' },
];

// Generate time slots from 8 AM to 10 PM (1-hour intervals)
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 8; hour < 22; hour++) {
    const startTime = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
    const endHour = hour + 1;
    const endTime = `${endHour > 12 ? endHour - 12 : endHour}:00 ${endHour >= 12 ? 'PM' : 'AM'}`;
    slots.push({
      id: `slot-${hour}`,
      start: startTime,
      end: endTime,
      hour: hour,
      available: Math.random() > 0.3, // Randomly mark some as booked for demo
    });
  }
  return slots;
};

interface BookingData {
  name: string;
  phone: string;
  console: string;
  slots: string[];
  date: string;
  amount: number;
}

export default function BookingForm() {
  const [step, setStep] = useState(1); // 1: Details, 2: Console, 3: Slot, 4: Payment
  const [formData, setFormData] = useState<BookingData>({
    name: '',
    phone: '',
    console: '',
    slots: [],
    date: new Date().toISOString().split('T')[0],
    amount: 0,
  });
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots());

  const selectedConsole = CONSOLE_TYPES.find(c => c.id === formData.console);
  const selectedSlots = timeSlots.filter(s => formData.slots.includes(s.id));

  const handleConsoleSelect = (consoleId: string) => {
    const console = CONSOLE_TYPES.find(c => c.id === consoleId);
    setFormData({ ...formData, console: consoleId, amount: 0, slots: [] });
    // Regenerate slots for demo (in real app, fetch from backend)
    setTimeSlots(generateTimeSlots());
  };

  const handleSlotSelect = (slotId: string) => {
    const isSelected = formData.slots.includes(slotId);
    let newSlots: string[];
    
    if (isSelected) {
      // Remove slot
      newSlots = formData.slots.filter(id => id !== slotId);
    } else {
      // Add slot
      newSlots = [...formData.slots, slotId];
    }
    
    // Calculate total amount (number of slots × hourly price)
    const totalAmount = newSlots.length * (selectedConsole?.price || 0);
    setFormData({ ...formData, slots: newSlots, amount: totalAmount });
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Details', icon: User },
          { num: 2, label: 'Console', icon: Gamepad2 },
          { num: 3, label: 'Time Slot', icon: Clock },
          { num: 4, label: 'Payment', icon: CreditCard },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= s.num 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600' 
                  : 'bg-white/10'
              } transition-all`}>
                {step > s.num ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <s.icon className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="text-xs mt-1 text-white/70">{s.label}</span>
            </div>
            {idx < 3 && (
              <div className={`h-0.5 flex-1 ${step > s.num ? 'bg-cyan-500' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: User Details */}
      {step === 1 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="text-xl font-bold mb-4">Your Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white/90">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-white/50" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/90">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-white/50" />
              <Input
                id="phone"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date" className="text-white/90">Booking Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-white/50" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!formData.name || !formData.phone || formData.phone.length < 10}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-6 rounded-xl"
          >
            Continue to Console Selection
          </Button>
        </div>
      )}

      {/* Step 2: Console Selection */}
      {step === 2 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4">Select Console/PC</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {CONSOLE_TYPES.map((console) => (
              <button
                key={console.id}
                onClick={() => handleConsoleSelect(console.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.console === console.id
                    ? 'border-cyan-500 bg-cyan-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/30'
                }`}
              >
                <div className="text-3xl mb-2">{console.icon}</div>
                <div className="text-sm font-semibold">{console.name}</div>
                <div className="text-xs text-cyan-400 mt-1">₹{console.price}/hr</div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              className="flex-1 bg-white/5 border-white/20 text-white py-6 rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!formData.console}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-6 rounded-xl"
            >
              Continue to Time Slots
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Time Slot Selection */}
      {step === 3 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Select Time Slots</h3>
              <p className="text-xs text-white/60 mt-1">Select multiple slots for extended gaming</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/70">
                {selectedConsole?.name}
              </div>
              <div className="text-xs text-cyan-400 font-semibold">
                ₹{selectedConsole?.price}/hr
              </div>
            </div>
          </div>
          
          {/* Selected slots summary */}
          {formData.slots.length > 0 && (
            <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-white/70">Selected: </span>
                  <span className="font-semibold text-cyan-400">{formData.slots.length} slot{formData.slots.length > 1 ? 's' : ''}</span>
                </div>
                <div className="text-lg font-bold text-cyan-400">
                  ₹{formData.amount}
                </div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6 max-h-96 overflow-y-auto">
            {timeSlots.map((slot) => {
              const isSelected = formData.slots.includes(slot.id);
              return (
                <button
                  key={slot.id}
                  onClick={() => slot.available && handleSlotSelect(slot.id)}
                  disabled={!slot.available}
                  className={`p-3 rounded-xl border transition-all text-sm ${
                    isSelected
                      ? 'border-cyan-500 bg-cyan-500/20 ring-2 ring-cyan-500/50'
                      : slot.available
                      ? 'border-white/10 bg-white/5 hover:border-white/30'
                      : 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <div className="font-semibold">{slot.start}</div>
                  <div className="text-xs text-white/50">to {slot.end}</div>
                  {isSelected && (
                    <div className="text-xs text-cyan-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Selected
                    </div>
                  )}
                  {!slot.available && (
                    <div className="text-xs text-red-400 mt-1">Booked</div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="flex-1 bg-white/5 border-white/20 text-white py-6 rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(4)}
              disabled={formData.slots.length === 0}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-6 rounded-xl"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Payment Summary */}
      {step === 4 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/70">Name</span>
              <span className="font-semibold">{formData.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/70">Phone</span>
              <span className="font-semibold">{formData.phone}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/70">Date</span>
              <span className="font-semibold">{new Date(formData.date).toLocaleDateString('en-IN', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/70">Console/PC</span>
              <span className="font-semibold">{selectedConsole?.name}</span>
            </div>
            
            {/* Time Slots List */}
            <div className="py-3 border-b border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Time Slots</span>
                <span className="text-xs text-cyan-400 font-semibold">
                  {formData.slots.length} slot{formData.slots.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="space-y-1">
                {selectedSlots.map((slot, idx) => (
                  <div key={slot.id} className="flex items-center justify-between text-sm bg-white/5 px-3 py-2 rounded-lg">
                    <span className="text-white/90">
                      {idx + 1}. {slot.start} - {slot.end}
                    </span>
                    <span className="text-cyan-400 font-semibold">
                      ₹{selectedConsole?.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Total Amount with breakdown */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl p-4 mt-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-white/70">Subtotal ({formData.slots.length} × ₹{selectedConsole?.price})</span>
                <span className="font-semibold">₹{formData.amount}</span>
              </div>
              <div className="h-px bg-white/10 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-cyan-400">₹{formData.amount}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(3)}
              variant="outline"
              className="flex-1 bg-white/5 border-white/20 text-white py-6 rounded-xl"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(5)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-6 rounded-xl"
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Payment Page Placeholder */}
      {step === 5 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
              <CreditCard className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold mb-3">Payment Gateway</h3>
            <p className="text-white/70 mb-8">
              Payment integration coming soon! Our secure payment gateway will be added here.
            </p>

            {/* Booking Summary Quick View */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
              <div className="text-sm text-white/60 mb-3">Your Booking Details:</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Console:</span>
                  <span className="font-semibold">{selectedConsole?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Slots:</span>
                  <span className="font-semibold">{formData.slots.length} slot{formData.slots.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Amount:</span>
                  <span className="font-bold text-cyan-400 text-lg">₹{formData.amount}</span>
                </div>
              </div>
            </div>

            {/* Home Button */}
            <Button
              onClick={handleGoHome}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-6 rounded-xl"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Home
            </Button>

            <p className="text-xs text-white/50 mt-4">
              Payment gateway integration will be added soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
