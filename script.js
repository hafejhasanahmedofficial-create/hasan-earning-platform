// ১. মেমোরি থেকে ব্যালেন্স এবং এডমিন লাভ লোড করা
let balance = parseFloat(localStorage.getItem('user_balance')) || 0.00;
let adminEarnings = parseFloat(localStorage.getItem('admin_earnings')) || 0.00; 
let canClick = false; 

const balanceDisplay = document.getElementById('user-balance');
const adButton = document.getElementById('ad-button');
const timerText = document.getElementById('timer-text');
const countdownDisplay = document.getElementById('countdown');

// স্ক্রিনে আগের ব্যালেন্স দেখানো
balanceDisplay.innerText = balance.toFixed(2);

// ২. অটোমেটিক ভিপিএন চেক
function checkVPN() {
    adButton.innerText = "ভিপিএন চেক করা হচ্ছে...";
    adButton.disabled = true;

    fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
        if (data.country_code === 'BD') {
            alert("⚠️ ভিপিএন অ্যালার্ট!\n\nএই অ্যাপটি চালাতে হলে আপনাকে অবশ্যই ভিপিএন (VPN) কানেক্ট করে USA বা UK সার্ভার সিলেক্ট করতে হবে।");
            adButton.innerText = "দয়া করে VPN চালু করুন";
            adButton.style.backgroundColor = '#7f8c8d';
            canClick = false;
        } else {
            adButton.innerText = "ভিডিও বিজ্ঞাপন দেখুন";
            adButton.style.backgroundColor = '#ff4757';
            adButton.disabled = false;
            canClick = true;
        }
    })
    .catch(error => {
        adButton.innerText = "ভিডিও বিজ্ঞাপন দেখুন";
        adButton.disabled = false;
        canClick = true;
    });
}

window.onload = checkVPN;

// ৩. বিজ্ঞাপনে ক্লিকের কাজ (২০ সেকেন্ড বিরতি এবং ৫০% লাভ সিস্টেম)
adButton.addEventListener('click', () => {
    if (!canClick) return;

    let totalAdRevenue = 80.00; 
    let userShare = totalAdRevenue * 0.50; 
    let adminShare = totalAdRevenue * 0.50; 

    balance += userShare;
    adminEarnings += adminShare;
    balanceDisplay.innerText = balance.toFixed(2);
    
    localStorage.setItem('user_balance', balance);
    localStorage.setItem('admin_earnings', adminEarnings);

    canClick = false;
    adButton.disabled = true;
    adButton.style.backgroundColor = '#ccc';
    adButton.innerText = 'বিজ্ঞাপন লোড হচ্ছে...';
    
    let timeLeft = 20; 
    timerText.style.display = 'block';
    countdownDisplay.innerText = timeLeft;
    
    const timer = setInterval(() => {
        timeLeft--;
        countdownDisplay.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkVPN();
            timerText.style.display = 'none';
        }
    }, 1000);
});

// ৪. আপনার ২টা জিমেইলে অটোমেটিক উইথড্র রিকোয়েস্ট পাঠানোর জাদুকরী কোড
document.getElementById('withdraw-btn').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    const number = document.getElementById('bkash-number').value;
    const withdrawBtn = document.getElementById('withdraw-btn');
    
    if (!amount || !number) {
        alert('দয়া করে সঠিক পরিমাণ এবং বিকাশ/নগদ নম্বর লিখুন!');
        return;
    }
    
    if (amount < 100) {
        alert('দুঃখিত! সর্বনিম্ন ১০০ টাকা না হলে উইথড্র করা যাবে না।');
        return;
    }
    
    if (amount > balance) {
        alert('আপনার অ্যাকাউন্টে পর্যাপ্ত ব্যালেন্স নেই!');
        return;
    }
    
    // বাটন লক করা যেন ইউজার বারবার চাপ না দেয়
    withdrawBtn.innerText = "রিকোয়েস্ট পাঠানো হচ্ছে...";
    withdrawBtn.disabled = true;
    withdrawBtn.style.backgroundColor = '#7f8c8d';

    // Formspree সার্ভারের মাধ্যমে আপনার দুটি জিমেইলে ডাটা পাঠানোর সিস্টেম
    fetch('https://formspree.io/f/xvgonbwd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Email_To_1: "Hafejhasanahmedpersonal@gmail.com",
            Email_To_2: "Hafejhasanahmedofficial@gmail.com",
            Message: "হাসান ভাই, একজন ইউজার উইথড্র রিকোয়েস্ট পাঠিয়েছে।",
            Amount: amount + " টাকা",
            Bkash_Or_Nagad_Number: number
        })
    })
    .then(response => {
        // রিকোয়েস্ট সফল হলে ইউজারের ব্যালেন্স কেটে নেওয়া
        balance -= amount;
        balanceDisplay.innerText = balance.toFixed(2);
        localStorage.setItem('user_balance', balance);
        
        document.getElementById('withdraw-amount').value = '';
        document.getElementById('bkash-number').value = '';
        
        alert('🎉 অভিনন্দন!\n\nআপনার উইথড্র রিকোয়েস্টটি সফলভাবে এডমিন হাসান ভাইয়ের কাছে চলে গেছে। খুব শীঘ্রই আপনার নম্বরে টাকা পৌঁছে যাবে।');
    })
    .catch(error => {
        alert('দুঃখিত! সার্ভারে কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    })
    .finally(() => {
        withdrawBtn.innerText = "উইথড্র রিকোয়েস্ট পাঠান";
        withdrawBtn.disabled = false;
        withdrawBtn.style.backgroundColor = '#2ed573';
    });
});
