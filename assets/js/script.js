const API_URL =
   "https://script.google.com/macros/s/AKfycbx0ZwjFofImJoBIoZfaQ8QTUKXxxmipYVLXPRCQu5FV85N-IUnuSuY3J9roZ4Gq5G9v/exec";

const vcContainer = document.getElementById("vc-events");

const showContainer = document.getElementById("show-recap");

/* =========================
   LOAD EVENT VC
========================= */

async function loadVC() {
   if (!vcContainer) return;

   try {
      const res = await fetch(API_URL + "?type=vc");

      const json = await res.json();

      const events = json.data || [];

      if (events.length === 0) {
         vcContainer.innerHTML = `

<p class="text-ink/50">
Belum ada jadwal VC.
</p>

`;

         return;
      }

      vcContainer.innerHTML = "";

      events.forEach((event, index) => {
         const id = "vc-" + index;

         vcContainer.insertAdjacentHTML(
            "beforeend",

            `

<div id="${id}"

class="
schedule-card
rounded-2xl
border
border-gold/30
bg-white/60
overflow-hidden
">


<div class="
bg-maroon-800
px-6
py-4
">


<h3 class="
font-display
text-cream
text-xl
">

${event.label}

</h3>


</div>



<div
class="p-6"
id="${id}-body">


<p class="
text-center
text-ink/50">

Memuat quota...

</p>


</div>


</div>

`,
         );

         loadQuota(event.code, id + "-body");
      });
   } catch (error) {
      console.error(error);

      vcContainer.innerHTML = `

<p class="text-crimson">

Gagal mengambil jadwal VC.

</p>

`;
   }
}

/* =========================
   LOAD QUOTA RECEH48
========================= */

async function loadQuota(code, target) {
   const box = document.getElementById(target);

   if (!box) return;

   try {
      const res = await fetch(
         "https://www.receh48.web.id/api/get-quota?code=" +
         encodeURIComponent(code),
      );

      const json = await res.json();

      const rows = [];

      (json.data.session || []).forEach((session) => {
         (session.session_detail || []).forEach((item) => {
            if ((item.jkt48_member_name || "").toLowerCase().includes("ribka")) {
               rows.push({
                  date: session.date,

                  session: session.label,

                  start: session.start_time,

                  end: session.end_time,

                  jalur: item.label,

                  quota: item.available_quota,
               });
            }
         });
      });

      if (rows.length === 0) {
         box.innerHTML = `

<p class="
text-center
text-ink/50">

Belum ada jalur Ribka.

</p>

`;

         return;
      }

      box.innerHTML = `

<div class="space-y-3">


${rows
            .map((r) => {
               const full = r.quota <= 0;

               return `


<div class="
flex
items-center
gap-4
rounded-xl
border
border-gold/20
bg-cream
px-4
py-3
">


<div class="
w-10
h-10
rounded-full
flex
items-center
justify-center

${full ? "bg-crimson/10 text-crimson" : "bg-flame/10 text-flame"}

">


${full ? "✕" : "✓"}


</div>



<div class="flex-1">


<p class="
font-semibold
text-sm">

${r.date}
·
${r.session}

</p>



<p class="
text-xs
text-ink/50
font-mono">

${r.start?.slice(0, 5)}
-
${r.end?.slice(0, 5)}

<br>

${r.jalur}

</p>


</div>



<div class="text-right">


<p class="
text-2xl
font-bold

${full ? "text-crimson" : "text-flame"}

">

${r.quota}

</p>



<p class="text-xs">

${full ? "Penuh" : "Tersisa"}

</p>


</div>


</div>


`;
            })
            .join("")}


</div>

`;
   } catch (error) {
      console.error(error);

      box.innerHTML = `

<p class="text-crimson">

Quota gagal dimuat.

</p>

`;
   }
}

/* =========================
   LOAD REKAP SHOW
========================= */

async function loadShow() {
   if (!showContainer) return;

   try {
      const res = await fetch(API_URL + "?type=show");

      const json = await res.json();

      const data = json.data[0];

      showContainer.innerHTML = `

<div class="
rounded-2xl
border
border-gold/30
bg-white/60
p-8
">


<div class="
grid
grid-cols-3
gap-5
text-center
">


<div>

<p class="
text-xs
font-mono
text-ink/50">

SHOW

</p>


<p class="
text-4xl
font-bold
text-flame">

${data.show}

</p>


</div>




<div>

<p class="
text-xs
font-mono
text-ink/50">

SHOWROOM

</p>


<p class="
text-4xl
font-bold
text-gold">

${data.showroom}

</p>


</div>





<div>

<p class="
text-xs
font-mono
text-ink/50">

IDN

</p>


<p class="
text-4xl
font-bold
text-crimson">

${data.idn}

</p>


</div>



</div>


</div>

`;
   } catch (error) {
      console.error(error);

      showContainer.innerHTML = `

<p class="text-crimson">
Rekap show gagal dimuat.
</p>

`;
   }
}

/* =========================
   START
========================= */

loadVC();

loadShow();

/* AUTO UPDATE */

setInterval(() => {
   loadVC();

   loadShow();
}, 60000);
