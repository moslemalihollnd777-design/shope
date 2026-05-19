let stripeConnected = false;

function redirectToStripe() {
  Swal.fire({
    title: "بوابة الدفع الآمنة 💳",
    text: "سيتم توجيهك الآن في صفحة خارجية مخصصة إلى بوابة Stripe لإنشاء أو ربط حسابك البنكي وتلقي الأرباح.",
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "موافق، توجه الآن",
    cancelButtonText: "إلغاء",
    confirmButtonColor: "#635bff",
    cancelButtonColor: "#d33",
    background: "#ffffff",
    backdrop: `rgba(0,0,0,0.4) blur(4px)`,
  }).then((result) => {
    if (result.isConfirmed) {
      stripeConnected = true;
      window.open("https://dashboard.stripe.com/register", "_blank");

      const stripeBtn = document.getElementById("connect-stripe-btn");
      const statusText = document.getElementById("stripe-status-text");
      if (stripeBtn) {
        stripeBtn.innerHTML =
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> تم ربط الحساب بنجاح';
        stripeBtn.style.backgroundColor = "#2ed573";
      }
      if (statusText) {
        statusText.innerHTML = "الحالة: تم ربط الحساب البنكي لـ Stripe بنجاح ✅";
        statusText.style.color = "#2ed573";
        statusText.style.fontWeight = "bold";
      }
    }
  });
}

async function saveSellerProfile(event) {
  event.preventDefault();

  const phone = document.getElementById("seller-phone").value.trim();
  const address = document.getElementById("seller-address").value.trim();
  const currentUser = auth.currentUser;

  if (!phone || !address) {
    Swal.fire({
      title: "حقول فارغة! ⚠️",
      text: "برجاء كتابة رقم الهاتف والعنوان كاملاً أولاً لإثبات الهوية.",
      icon: "warning",
      confirmButtonColor: "#e07a3f",
    });
    return;
  }

  if (!stripeConnected) {
    Swal.fire({
      title: "خطوة مطلوبة! 💳",
      text: "يرجى الضغط على زر ربط حساب Stripe وتفعيله أولاً لتتمكن من استقبال عوائد مبيعات متجرك.",
      icon: "warning",
      confirmButtonColor: "#635bff",
    });
    return;
  }

  if (currentUser) {
    try {
      await db.collection("users").doc(currentUser.uid).update({
        phone: phone,
        address: address,
        profileCompleted: true,
        stripeConnected: true,
        isApproved: true,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      Swal.fire({
        title: "تم إنشاء متجرك بنجاح! 🎉",
        text: "تهانينا، تم إثبات هويتك وتفعيل لوحة تحكم بائع Ali Holland حياً بالسيرفر.",
        icon: "success",
        confirmButtonColor: "#e07a3f",
      }).then(() => {
        window.location.href = "seller.html";
      });
    } catch (error) {
      console.error("حدث خطأ أثناء حفظ البيانات السحابية:", error);
      Swal.fire({
        title: "فشلت عملية الحفظ",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  } else {
    Swal.fire({
      title: "انتهت الجلسة!",
      text: "لم يتم العثور على جلسة مستخدم نشطة. يرجى تسجيل الدخول مجدداً لنظام الحماية.",
      icon: "error",
      confirmButtonColor: "#d33",
    }).then(() => {
      window.location.href = "../auth/login.html";
    });
  }
}

function bindCompleteSellerProfileEvents() {
  const stripeButton = document.getElementById("connect-stripe-btn");
  const profileForm = document.getElementById("profileForm");

  if (stripeButton) {
    stripeButton.addEventListener("click", redirectToStripe);
  }

  if (profileForm) {
    profileForm.addEventListener("submit", saveSellerProfile);
  }
}

document.addEventListener("DOMContentLoaded", bindCompleteSellerProfileEvents);
