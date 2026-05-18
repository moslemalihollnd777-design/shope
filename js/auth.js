// ========================================================
// 1. التبديل بين التبويبات (لصفحات تسجيل الدخول والإنشاء)
// ========================================================
function showTab(type) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTabBtn = document.getElementById('loginTabBtn');
    const signupTabBtn = document.getElementById('signupTabBtn');

    if (loginForm && signupForm) {
        if (type === 'login') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            if (loginTabBtn) loginTabBtn.classList.add('active');
            if (signupTabBtn) signupTabBtn.classList.remove('active');
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            if (loginTabBtn) loginTabBtn.classList.remove('active');
            if (signupTabBtn) signupTabBtn.classList.add('active');
        }
    }
}

// ========================================================
// 2. دالة إنشاء حساب جديد (محدثة بالتوجيه المباشر والآمن)
// ========================================================
const signupFormElement = document.getElementById('signupForm');
if (signupFormElement) {
    signupFormElement.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('signupEmail').value.trim();
        const pass = document.getElementById('signupPass').value;
        const name = document.getElementById('userName').value.trim();
        
        // قراءة رتبة الحساب المحددة (مشتري أم بائع)
        const roleRadio = document.querySelector('input[name="userRole"]:checked');
        const role = roleRadio ? roleRadio.value : 'customer'; 

        auth.createUserWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            // حفظ بيانات المستخدم في قاعدة البيانات الفايربيز
            return db.collection("users").doc(userCredential.user.uid).set({
                uid: userCredential.user.uid,
                name: name,
                email: email,
                role: role,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            alert("تم إنشاء الحساب بنجاح! 🎉");
            
            // توجيه فوري مباشر بدون صفحات وسيطة مسببة للمشاكل
            if (role === 'seller') {
                window.location.href = "../seller/seller.html"; // البائع يذهب للوحته مباشرة لرفع المنتجات
            } else {
                window.location.href = "../index.html"; // الزبون يذهب للتسوق فوراً في الرئيسية
            }
        })
        .catch(err => {
            console.error("خطأ أثناء التسجيل الحقيقي:", err);
            alert("خطأ في التسجيل: " + err.message);
        });
    });
}

// ========================================================
// 3. دالة تسجيل الدخول للحسابات الحالية
// ========================================================
const loginFormElement = document.getElementById('loginForm');
if (loginFormElement) {
    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPass').value;

        auth.signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            // جلب رتبة المستخدم من قاعدة البيانات لتوجيهه بشكل صحيح
            return db.collection("users").doc(userCredential.user.uid).get();
        })
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.role === 'seller') {
                    window.location.href = "../seller/seller.html"; // إذا كان بائعاً يدخل للوحته فوراً
                } else {
                    window.location.href = "../index.html"; // إذا كان زبوناً يذهب للرئيسية
                }
            } else {
                window.location.href = "../index.html";
            }
        })
        .catch(err => {
            console.error("خطأ أثناء الدخول:", err);
            alert("خطأ في بيانات الدخول: " + err.message);
        });
    });
}