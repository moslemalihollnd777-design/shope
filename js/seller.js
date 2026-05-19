// Page-specific logic for seller/seller.html
let currentSeller = null;
let base64Image = "";

function showSellerAccessDenied(message, redirectUrl) {
  Swal.fire({
    title: "وصول ممنوع! ⚠️",
    text: message,
    icon: "warning",
    confirmButtonColor: "#ff8c00",
    confirmButtonText: "العودة للرئيسية",
  }).then(() => {
    window.location.href = redirectUrl;
  });
}

function handleSellerAuthState(user) {
  if (!user) {
    window.location.href = "../auth/login.html";
    return;
  }

  db.collection("users")
    .doc(user.uid)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        window.location.href = "../auth/login.html";
        return;
      }

      const userData = doc.data();
      if (userData.role !== "seller") {
        showSellerAccessDenied(
          "عذراً، هذه اللوحة مخصصة للحسابات التجارية فقط!",
          "../index.html",
        );
        return;
      }

      if (!userData.profileCompleted) {
        Swal.fire({
          title: "تنبيه أمني هام! ⚠️",
          text: "عذراً، لا يمكنك تصفح لوحة التحكم. يجب عليك إكمال وثائق متجرك وتفعيل الحساب أولاً.",
          icon: "error",
          confirmButtonText: "الانتقال لصفحة التوثيق الحين",
          confirmButtonColor: "#ff8c00",
          allowOutsideClick: false,
          allowEscapeKey: false,
          background: "#ffffff",
          backdrop: `rgba(0,0,0,0.7) blur(8px)`,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "complete-seller-profile.html";
          }
        });
        return;
      }

      currentSeller = user;
      const welcomeMsg = document.getElementById("welcome-msg");
      if (welcomeMsg) {
        welcomeMsg.innerText = `مرحباً بك، متجر ${userData.shopName || user.email}`;
      }
    })
    .catch(() => {
      window.location.href = "../auth/login.html";
    });
}

function calculateLiveCommission() {
  const priceInput = document.getElementById("pPrice");
  const displayValue = document.getElementById("calcValue");
  const price = parseFloat(priceInput.value);

  if (price > 0) {
    displayValue.innerText = (price * 0.04).toFixed(2);
  } else {
    displayValue.innerText = "0.00";
  }
}

function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;

    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      base64Image = canvas.toDataURL("image/jpeg", 0.7);
      const output = document.getElementById("imagePreview");
      if (output) {
        output.src = base64Image;
        output.classList.remove("hidden");
      }

      const uploadIcon = document.getElementById("uploadIcon");
      const uploadText = document.getElementById("uploadText");
      if (uploadIcon) uploadIcon.classList.add("hidden");
      if (uploadText) uploadText.classList.add("hidden");
    };
  };
  reader.readAsDataURL(file);
}

function handleProductFormSubmit(event) {
  event.preventDefault();

  if (!currentSeller) {
    Swal.fire({
      title: "خطأ",
      text: "انتهت جلسة تسجيل الدخول، يرجى إعادة الدخول للموقع.",
      icon: "error",
      confirmButtonColor: "#ff8c00",
    });
    return;
  }

  const submitBtn = document.getElementById("submitBtn");
  const title = document.getElementById("pName").value.trim();
  const description = document.getElementById("productDescription").value.trim();
  const category = document.getElementById("productCategory").value;
  const price = parseFloat(document.getElementById("pPrice").value);

  submitBtn.disabled = true;
  submitBtn.innerText = "... جاري معالجة ونشر منتجك حياً في المتجر";

  db.collection("products")
    .add({
      title,
      description,
      category,
      price,
      imageUrl: base64Image || "assets/logo.jpg",
      sellerId: currentSeller.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      Swal.fire({
        title: "تم النشر بنجاح! 🎉",
        text: `رائع! تم نشر "${title}" وتفعيله تلقائياً في واجهة المتجر الرئيسية للزبائن.`,
        icon: "success",
        confirmButtonColor: "#ff8c00",
      });

      document.getElementById("productForm").reset();
      document.getElementById("imagePreview").classList.add("hidden");
      document.getElementById("uploadIcon").classList.remove("hidden");
      document.getElementById("uploadText").classList.remove("hidden");
      document.getElementById("calcValue").innerText = "0.00";
      base64Image = "";
      submitBtn.disabled = false;
      submitBtn.innerText = "نشر المنتج الآن";
    })
    .catch((error) => {
      console.error("خطأ أثناء الرفع الحقيقي:", error);
      Swal.fire({
        title: "فشل النشر",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#ff8c00",
      });
      submitBtn.disabled = false;
      submitBtn.innerText = "نشر المنتج الآن";
    });
}

function logoutSeller() {
  auth.signOut().then(() => {
    window.location.href = "../index.html";
  });
}

function bindSellerEvents() {
  const uploadBox = document.querySelector(".upload-box");
  if (uploadBox) {
    uploadBox.addEventListener("click", () => {
      const productImage = document.getElementById("productImage");
      if (productImage) {
        productImage.click();
      }
    });
  }

  const productImageInput = document.getElementById("productImage");
  if (productImageInput) {
    productImageInput.addEventListener("change", previewImage);
  }

  const priceInput = document.getElementById("pPrice");
  if (priceInput) {
    priceInput.addEventListener("input", calculateLiveCommission);
  }

  const productForm = document.getElementById("productForm");
  if (productForm) {
    productForm.addEventListener("submit", handleProductFormSubmit);
  }

  const logoutLink = document.getElementById("logoutSellerLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      logoutSeller();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  bindSellerEvents();
  auth.onAuthStateChanged(handleSellerAuthState);
});
