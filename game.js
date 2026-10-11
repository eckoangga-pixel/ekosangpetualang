/* PETUALANGAN ILMU — game prototype. Three.js is loaded from CDN. */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const subjects=[
{name:'IPAS',icon:'🌎',color:'#1685d8',boss:'Profesor Alam'},
{name:'Matematika',icon:'🔢',color:'#ef8b12',boss:'Raja Angka'},
{name:'Bahasa Indonesia',icon:'📖',color:'#d63b4e',boss:'Penjaga Kata'},
{name:'Pendidikan Pancasila',icon:'🇮🇩',color:'#873be0',boss:'Garuda Pengetahuan'},
{name:'Bahasa Jawa',icon:'🏯',color:'#a04b1c',boss:'Ki Lelana Basa'},
{name:'Pendidikan Agama Islam',icon:'☪️',color:'#189b61',boss:'Sahabat Akhlak'},
{name:'PJOK',icon:'⚽',color:'#159eaa',boss:'Pelatih Sehat'},
{name:'Bahasa Inggris',icon:'🇬🇧',color:'#2465bd',boss:'Captain English'}
];
const colors=['#4cce51','#258fe7','#f4a326','#a64be8','#ee4e45','#17bfc4'];
let cfg={kelas:5,subject:'IPAS',difficulty:'mudah',mode:'solo',players:['Petualang'],turn:0};
let stats={stars:0,coins:0,points:0,correct:0,wrong:0,answered:0,level:1};
let questionList=[],currentQ=0,locked=false,timer=null,timeLeft=30,soundOn=true;
let scene,camera,renderer,clock,player,worldObjects=[],keys={},nearObject=null,animId,threeReady=false,questionStartedAt=0;
let moveDir=0,velocityY=0,onGround=true,playerX=0,worldOffset=0,levelStart=Date.now(),jumping=false;
const DB={
'IPAS':[
['Makhluk hidup membutuhkan apa agar tetap hidup?',['Air, udara, dan makanan','Batu dan plastik','Hanya cahaya','Mainan'],'Air, udara, dan makanan','Makhluk hidup memerlukan air, udara, dan nutrisi untuk hidup.'],
['Bagian tumbuhan yang menyerap air dari tanah adalah …',['Daun','Akar','Bunga','Buah'],'Akar','Akar menyerap air dan mineral dari tanah.'],
['Hewan pemakan tumbuhan disebut …',['Karnivor','Omnivor','Herbivor','Predator'],'Herbivor','Herbivor adalah hewan yang makan tumbuhan.'],
['Sumber energi utama bagi Bumi adalah …',['Bulan','Matahari','Angin malam','Batu'],'Matahari','Matahari memberikan cahaya dan panas bagi Bumi.'],
['Perubahan air menjadi uap disebut …',['Membeku','Menguap','Mengembun','Mencair'],'Menguap','Panas dapat mengubah air cair menjadi uap.'],
['Hubungan makan dan dimakan disebut …',['Rantai makanan','Daur air','Gaya gesek','Rotasi'],'Rantai makanan','Rantai makanan menunjukkan perpindahan energi antarmakhluk hidup.'],
['Gaya dapat membuat benda …',['Berubah gerak','Hilang selamanya','Tidak terlihat','Menjadi hidup'],'Berubah gerak','Gaya dapat mengubah gerak atau bentuk benda.'],
['Contoh sumber daya alam yang dapat diperbarui adalah …',['Minyak bumi','Batu bara','Sinar matahari','Gas alam'],'Sinar matahari','Sinar matahari tersedia kembali secara alami.'],
['Agar lingkungan tetap bersih kita sebaiknya …',['Membuang sampah ke sungai','Memilah sampah','Membakar semua sampah','Menebang pohon'],'Memilah sampah','Memilah sampah membantu pengelolaan sampah yang tepat.'],
['Air di permukaan bumi menguap, membentuk awan, lalu turun sebagai hujan. Ini disebut …',['Siklus air','Rantai makanan','Fotosintesis','Rotasi'],'Siklus air','Siklus air adalah perputaran air di alam.']],
'Matematika':[
['Berapakah 7 + 5?',['10','11','12','13'],'12','7 ditambah 5 sama dengan 12.'],
['Berapakah 6 × 4?',['20','24','28','18'],'24','Enam kelompok berisi empat benda berjumlah 24.'],
['Berapakah 36 ÷ 6?',['5','6','7','8'],'6','36 dibagi 6 sama dengan 6.'],
['Pecahan yang senilai dengan 1/2 adalah …',['2/3','2/4','3/5','1/3'],'2/4','Dua per empat sama nilainya dengan setengah.'],
['Keliling persegi dengan sisi 5 cm adalah …',['10 cm','15 cm','20 cm','25 cm'],'20 cm','Keliling persegi = 4 × sisi = 4 × 5 = 20 cm.'],
['Berapakah 125 + 275?',['300','350','400','450'],'400','125 + 275 = 400.'],
['Pukul 07.15 ditambah 45 menit menjadi pukul …',['07.45','08.00','08.15','08.30'],'08.00','45 menit setelah 07.15 adalah 08.00.'],
['Luas persegi panjang 8 cm × 4 cm adalah …',['12 cm²','24 cm²','32 cm²','36 cm²'],'32 cm²','Luas = panjang × lebar = 8 × 4 = 32 cm².'],
['FPB dari 12 dan 18 adalah …',['3','6','9','12'],'6','Faktor persekutuan terbesar 12 dan 18 adalah 6.'],
['Jika 3 buku seharga Rp6.000, harga 5 buku adalah …',['Rp8.000','Rp9.000','Rp10.000','Rp12.000'],'Rp10.000','Satu buku Rp2.000, maka lima buku Rp10.000.']],
'Bahasa Indonesia':[
['Lawan kata “tinggi” adalah …',['Besar','Rendah','Panjang','Lebar'],'Rendah','Rendah adalah antonim dari tinggi.'],
['Sinonim kata “gembira” adalah …',['Sedih','Marah','Senang','Takut'],'Senang','Gembira memiliki arti yang sama dengan senang.'],
['Kalimat yang menggunakan huruf kapital dengan benar adalah …',['andi pergi ke tegal.','Andi pergi ke Tegal.','Andi pergi ke tegal.','andi pergi ke Tegal.'],'Andi pergi ke Tegal.','Nama orang dan nama tempat diawali huruf kapital.'],
['Ide pokok adalah …',['Gagasan utama paragraf','Judul buku saja','Nama penulis','Kalimat penutup'],'Gagasan utama paragraf','Ide pokok merupakan inti pembahasan paragraf.'],
['Tanda baca untuk mengakhiri kalimat tanya adalah …',['Titik (.)','Koma (,)','Tanya (?)','Seru (!)'],'Tanya (?)','Kalimat tanya diakhiri tanda tanya.'],
['Kata dasar dari “bermain” adalah …',['Main','Bermain','Permainan','Pemain'],'Main','Kata bermain terbentuk dari kata dasar main.'],
['Teks yang menggambarkan ciri-ciri suatu objek disebut teks …',['Deskripsi','Prosedur','Berita','Drama'],'Deskripsi','Teks deskripsi menjelaskan objek secara terperinci.'],
['Kalimat majemuk setara menggabungkan …',['Dua klausa setara','Kata saja','Judul dan gambar','Huruf dan angka'],'Dua klausa setara','Klausa dalam kalimat majemuk setara memiliki kedudukan setara.'],
['Pesan yang ingin disampaikan penulis dalam cerita disebut …',['Tokoh','Amanat','Latar','Alur'],'Amanat','Amanat adalah pesan atau pelajaran dari cerita.'],
['Ringkasan yang baik berisi …',['Semua kalimat disalin','Pokok informasi penting','Pendapat tanpa isi','Hanya nama tokoh'],'Pokok informasi penting','Ringkasan menyampaikan inti bacaan secara singkat.']],
'Pendidikan Pancasila':[
['Berapa jumlah sila dalam Pancasila?',['3','4','5','6'],'5','Pancasila memiliki lima sila.'],
['Lambang sila pertama adalah …',['Bintang','Rantai','Pohon beringin','Kepala banteng'],'Bintang','Bintang melambangkan sila Ketuhanan Yang Maha Esa.'],
['Bekerja bersama membersihkan kelas disebut …',['Bersaing','Gotong royong','Bertengkar','Memaksa'],'Gotong royong','Gotong royong berarti bekerja bersama untuk tujuan baik.'],
['Keputusan bersama sebaiknya diambil melalui …',['Musyawarah','Paksaan','Pertengkaran','Ancaman'],'Musyawarah','Musyawarah memberi kesempatan semua orang menyampaikan pendapat.'],
['Semboyan bangsa Indonesia adalah …',['Tut Wuri Handayani','Bhinneka Tunggal Ika','Ing Ngarsa Sung Tuladha','Merdeka Belajar'],'Bhinneka Tunggal Ika','Artinya berbeda-beda tetapi tetap satu.'],
['Contoh kewajiban siswa di sekolah adalah …',['Mendapat pelajaran','Memakai fasilitas','Mematuhi tata tertib','Mendapat perlindungan'],'Mematuhi tata tertib','Kewajiban adalah sesuatu yang harus dilakukan.'],
['Menghargai teman yang berbeda budaya menunjukkan sikap …',['Toleransi','Egois','Sombong','Acuh'],'Toleransi','Toleransi berarti menghargai perbedaan.'],
['Simbol sila ketiga adalah …',['Padi dan kapas','Rantai','Pohon beringin','Bintang'],'Pohon beringin','Pohon beringin melambangkan Persatuan Indonesia.'],
['Hak dan kewajiban harus dilaksanakan secara …',['Seimbang','Sesuka hati','Berat sebelah','Terpaksa'],'Seimbang','Hak dan kewajiban perlu dilaksanakan secara seimbang.'],
['Saat teman menyampaikan pendapat, kita sebaiknya …',['Mengejek','Mendengarkan','Memotong terus','Pergi'],'Mendengarkan','Mendengarkan adalah sikap menghargai pendapat.']],
'Bahasa Jawa':[
['Tembung “mangan” tegese …',['Tidur','Makan','Minum','Berjalan'],'Makan','Mangan tegese makan.'],
['Basa krama saka “mangan” yaiku …',['Turu','Nedha','Mlaku','Lunga'],'Nedha','Nedha merupakan bentuk krama untuk makan.'],
['“Sugeng enjing” tegese …',['Selamat malam','Selamat pagi','Selamat siang','Sampai jumpa'],'Selamat pagi','Sugeng enjing digunakan untuk menyapa pada pagi hari.'],
['Tembung kosok balen “gedhe” yaiku …',['Dawa','Cilik','Dhuwur','Akeh'],'Cilik','Gedhe berlawanan arti dengan cilik.'],
['Aksara Jawa dikenal juga dengan sebutan …',['Hanacaraka','Pallawa','Latin','Arab'],'Hanacaraka','Hanacaraka adalah sebutan populer untuk aksara Jawa.'],
['“Matur nuwun” tegese …',['Terima kasih','Permisi','Maaf','Silakan'],'Terima kasih','Matur nuwun digunakan untuk berterima kasih.'],
['Tembang dolanan biasanya dinyanyikan oleh …',['Anak-anak','Hanya raja','Hanya pedagang','Hanya guru'],'Anak-anak','Tembang dolanan merupakan lagu permainan anak.'],
['“Omah” tegese …',['Sekolah','Rumah','Pasar','Sawah'],'Rumah','Omah dalam bahasa Indonesia berarti rumah.'],
['Nalika ketemu guru, kita kudu …',['Nglawan','Sopan santun','Ngguyu banter','Mlayu'],'Sopan santun','Kita harus bersikap sopan kepada guru.'],
['Crita rakyat diwarisake kanthi cara …',['Turun-temurun','Dibuwang','Digawe rahasia','Dilarang'],'Turun-temurun','Cerita rakyat diwariskan antargenerasi.']],
'Pendidikan Agama Islam':[
['Rukun Islam berjumlah …',['3','4','5','6'],'5','Rukun Islam ada lima.'],
['Kitab suci umat Islam adalah …',['Taurat','Zabur','Al-Qur’an','Injil'],'Al-Qur’an','Al-Qur’an adalah kitab suci umat Islam.'],
['Sebelum salat, umat Islam bersuci dengan …',['Tidur','Wudu','Bermain','Makan'],'Wudu','Wudu dilakukan untuk bersuci sebelum salat.'],
['Berkata sesuai kenyataan disebut …',['Jujur','Bohong','Iri','Sombong'],'Jujur','Kejujuran adalah berkata dan bertindak sesuai kenyataan.'],
['Salat wajib sehari semalam berjumlah …',['3 waktu','4 waktu','5 waktu','6 waktu'],'5 waktu','Salat wajib dilaksanakan lima waktu sehari semalam.'],
['Puasa Ramadan mengajarkan kita untuk …',['Boros','Sabar dan menahan diri','Mengejek','Malas'],'Sabar dan menahan diri','Puasa melatih kesabaran dan pengendalian diri.'],
['Jika mendapat bantuan, kita sebaiknya …',['Berterima kasih','Marah','Diam sambil mengejek','Membalas buruk'],'Berterima kasih','Mengucapkan terima kasih adalah akhlak yang baik.'],
['Rukun iman yang pertama adalah iman kepada …',['Malaikat','Kitab','Allah','Rasul'],'Allah','Rukun iman pertama adalah iman kepada Allah.'],
['Menjaga kebersihan merupakan perilaku …',['Terpuji','Buruk','Sia-sia','Tidak peduli'],'Terpuji','Kebersihan merupakan perilaku yang baik.'],
['Ketika teman kesulitan, kita sebaiknya …',['Menertawakan','Menolong','Meninggalkan','Memarahi'],'Menolong','Tolong-menolong adalah akhlak terpuji.']],
'PJOK':[
['Sebelum olahraga sebaiknya melakukan …',['Pemanasan','Langsung tidur','Makan berlebihan','Duduk lama'],'Pemanasan','Pemanasan menyiapkan tubuh sebelum berolahraga.'],
['Gerak berpindah tempat disebut gerak …',['Lokomotor','Nonlokomotor','Diam','Manipulatif'],'Lokomotor','Contoh gerak lokomotor adalah berjalan dan berlari.'],
['Agar tubuh sehat, kita perlu …',['Aktif bergerak','Tidak pernah minum','Begadang terus','Menghindari sayur'],'Aktif bergerak','Aktivitas fisik membantu menjaga kebugaran tubuh.'],
['Dalam permainan sepak bola, bola dimainkan terutama dengan …',['Tangan','Kaki','Siku','Kepala saja'],'Kaki','Pemain sepak bola umumnya memainkan bola dengan kaki.'],
['Setelah olahraga, kita perlu …',['Pendinginan','Langsung berlari lagi','Tidak minum seharian','Duduk tanpa jeda'],'Pendinginan','Pendinginan membantu tubuh kembali ke kondisi istirahat.'],
['Makanan bergizi seimbang membantu …',['Menjaga kesehatan','Membuat sakit','Menghilangkan tidur','Mengurangi semua energi'],'Menjaga kesehatan','Gizi seimbang membantu pertumbuhan dan kesehatan.'],
['Saat bermain, kita harus mematuhi …',['Aturan keselamatan','Keinginan sendiri','Tantangan berbahaya','Ajakan berkelahi'],'Aturan keselamatan','Aturan keselamatan melindungi semua pemain.'],
['Gerakan menekuk lutut di tempat termasuk gerak …',['Nonlokomotor','Lokomotor','Melompat jauh','Berjalan'],'Nonlokomotor','Gerak nonlokomotor dilakukan tanpa berpindah tempat.'],
['Contoh permainan tradisional Indonesia adalah …',['Gobak sodor','Ski es','Hoki es','Rugbi salju'],'Gobak sodor','Gobak sodor adalah salah satu permainan tradisional Indonesia.'],
['Minum air setelah aktivitas membantu mencegah …',['Dehidrasi','Belajar','Pertumbuhan','Kebugaran'],'Dehidrasi','Tubuh memerlukan cairan yang cukup setelah bergerak.']],
'Bahasa Inggris':[
['What color is the sky on a clear day?',['Green','Blue','Pink','Black'],'Blue','The sky is usually blue on a clear day.'],
['“Cat” dalam bahasa Indonesia berarti …',['Anjing','Kucing','Burung','Ikan'],'Kucing','Cat means kucing.'],
['How do you say “Selamat pagi” in English?',['Good night','Good morning','Good bye','Good afternoon'],'Good morning','Good morning is used to greet someone in the morning.'],
['What number comes after nine?',['Seven','Eight','Ten','Eleven'],'Ten','Ten comes after nine.'],
['The plural of “book” is …',['Bookes','Books','Bookies','Book'],'Books','Most nouns add -s to form the plural.'],
['“Mother” means …',['Ayah','Ibu','Kakak','Paman'],'Ibu','Mother means ibu.'],
['Which one is a fruit?',['Carrot','Potato','Mango','Rice'],'Mango','Mango is a fruit.'],
['Complete: I ___ a student.',['am','is','are','be'],'am','Use “I am” in this sentence.'],
['Which day comes after Monday?',['Sunday','Tuesday','Friday','Saturday'],'Tuesday','Tuesday comes after Monday.'],
['“Open your book” means …',['Tutup bukumu','Buka bukumu','Baca papan','Angkat tangan'],'Buka bukumu','Open means buka, and your book means bukumu.']]
};
function say(text){if(!soundOn)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='id-ID';u.rate=1.03;speechSynthesis.speak(u)}catch(e){}}
function tone(freq=520,dur=.08){if(!soundOn)return;try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;o.type='sine';g.gain.value=.06;o.connect(g);g.connect(c.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);o.stop(c.currentTime+dur)}catch(e){}}
function renderMenus(){
$('#classChoices').innerHTML=Array.from({length:6},(_,i)=>`<button class="class-choice ${cfg.kelas===i+1?'selected':''}" data-class="${i+1}" style="background:linear-gradient(#ffffff25,transparent),${colors[i]}"><span>${['🌱','🌲','🌊','⛰️','🏝️','🏰'][i]}</span>Kelas ${i+1}</button>`).join('');
$('#subjectChoices').innerHTML=subjects.map(s=>`<button class="subject-choice ${cfg.subject===s.name?'selected':''}" data-subject="${s.name}"><span>${s.icon}</span><b>${s.name}</b></button>`).join('');
}
renderMenus();
document.addEventListener('click',e=>{
const c=e.target.closest('[data-class]');if(c){cfg.kelas=+c.dataset.class;renderMenus();tone(660);return}
const s=e.target.closest('[data-subject]');if(s){cfg.subject=s.dataset.subject;renderMenus();tone(660);return}
const m=e.target.closest('[data-mode]');if(m){cfg.mode=m.dataset.mode;$$('[data-mode]').forEach(x=>x.classList.toggle('selected',x===m));tone(600);if(cfg.mode!=='solo')showPlayerSetup();return}
const d=e.target.closest('[data-difficulty]');if(d){cfg.difficulty=d.dataset.difficulty;$$('[data-difficulty]').forEach(x=>x.classList.toggle('selected',x===d));tone(600);return}
const close=e.target.closest('[data-close]');if(close){$('#'+close.dataset.close).classList.add('hidden');return}
});
function showPlayerSetup(){let n=cfg.mode==='duo'?2:cfg.mode==='group'?5:1;$('#playerInputs').innerHTML=Array.from({length:n},(_,i)=>`<input maxlength="20" placeholder="Nama pemain ${i+1}" value="${cfg.players[i]||''}" aria-label="Nama pemain ${i+1}">`).join('');$('#setupModal').classList.remove('hidden')}
$('#savePlayers').onclick=()=>{cfg.players=$$('#playerInputs input').map((x,i)=>x.value.trim()||`Pemain ${i+1}`);$('#setupModal').classList.add('hidden');tone(700)};
$('#startBtn').onclick=()=>{if(cfg.mode!=='solo'&&cfg.players.length<(cfg.mode==='duo'?2:3))showPlayerSetup();else startGame()};
$('#helpBtn').onclick=()=>$('#helpModal').classList.remove('hidden');
$('#soundBtn').onclick=()=>{soundOn=!soundOn;$('#soundBtn').textContent=soundOn?'🔊':'🔇';tone(440)};
$('#homeBtn').onclick=()=>goHome();$('#pauseBtn').onclick=()=>pauseGame();$('#resumeBtn').onclick=()=>resumeGame();
$('#pauseHomeBtn').onclick=()=>goHome();$('#restartBtn').onclick=()=>{closeModal('pauseModal');resetLevel();};
$('#resultHomeBtn').onclick=()=>goHome();$('#playAgainBtn').onclick=()=>{closeModal('resultModal');resetLevel()};
$('#closeQuestion').onclick=()=>{closeModal('questionModal');locked=false};
function closeModal(id){$('#'+id).classList.add('hidden')}
function startGame(){stats={stars:0,coins:0,points:0,correct:0,wrong:0,answered:0,level:1};currentQ=0;questionList=buildQuestions();levelStart=Date.now();$('#homeScreen').classList.add('hidden');$('#gameScreen').classList.remove('hidden');$('#hudClass').textContent='Kelas '+cfg.kelas;$('#hudSubject').textContent=cfg.subject;$('#hudLevel').textContent='Level 1';$('#questText').textContent=`Temukan kristal ilmu dan selesaikan misi ${cfg.subject}!`;updateHUD();initWorld();say('Selamat datang, petualang! Ayo jelajahi dunia ilmu.');}
function buildQuestions(){let source=DB[cfg.subject]||DB.IPAS;let arr=source.map(q=>({q:q[0],a:[...q[1]],correct:q[2],explain:q[3]}));if(cfg.difficulty==='mudah')arr=arr.slice(0,10);if(cfg.difficulty==='sedang')arr=arr.map(q=>({...q,a:shuffle(q.a)}));if(cfg.difficulty==='sulit')arr=arr.map(q=>({...q,a:shuffle(q.a),q:'⭐ Tantangan: '+q.q}));return shuffle(arr).slice(0,10)}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function updateHUD(){ $('#stars').textContent=stats.stars;$('#coins').textContent=stats.coins;$('#points').textContent=stats.points;$('#progressFill').style.width=(stats.answered/10*100)+'%';$('#progressLabel').textContent=`${stats.answered} / 10 tantangan`;$('#hudLevel').textContent='Level '+stats.level;}
function openQuestion(){if($('#questionModal').classList.contains('hidden')===false||currentQ>=questionList.length)return;nearObject=null;$('#interactPrompt').classList.add('hidden');locked=false;const q=questionList[currentQ];$('#questionTag').textContent=`${cfg.subject.toUpperCase()} • KELAS ${cfg.kelas}`;$('#questionCount').textContent=`Tantangan ${currentQ+1}/10`;$('#questionText').textContent=q.q;$('#feedback').className='feedback hidden';$('#nextQuestion').classList.add('hidden');$('#answerChoices').innerHTML=q.a.map((a,i)=>`<button class="answer-btn" data-answer="${encodeURIComponent(a)}">${String.fromCharCode(65+i)}. ${a}</button>`).join('');$('#questionModal').classList.remove('hidden');timeLeft=cfg.difficulty==='mudah'?40:cfg.difficulty==='sedang'?30:20;$('#timerText').textContent='⏱ '+timeLeft;clearInterval(timer);timer=setInterval(()=>{timeLeft--;$('#timerText').textContent='⏱ '+timeLeft;if(timeLeft<=0){clearInterval(timer);if(!locked)answerQuestion(null)}},1000);tone(750)}
$('#answerChoices').addEventListener('click',e=>{const b=e.target.closest('[data-answer]');if(b&&!locked)answerQuestion(decodeURIComponent(b.dataset.answer))});
function answerQuestion(answer){if(locked)return;locked=true;clearInterval(timer);const q=questionList[currentQ],ok=answer===q.correct;$$('.answer-btn').forEach(b=>{const a=decodeURIComponent(b.dataset.answer);if(a===q.correct)b.classList.add('correct');else if(a===answer)b.classList.add('wrong');b.disabled=true});const fb=$('#feedback');fb.classList.remove('hidden');if(ok){stats.correct++;stats.points+=cfg.difficulty==='sulit'?20:cfg.difficulty==='sedang'?15:10;stats.coins+=5;stats.stars+=1;fb.className='feedback';fb.innerHTML=`🎉 HEBAT! JAWABANMU BENAR!<br><small>${q.explain}</small>`;say(cfg.subject==='Bahasa Inggris'?'Good job! Excellent!':'Hebat! Jawabanmu benar!');tone(880,.18)}else{stats.wrong++;fb.className='feedback wrong-feedback';fb.innerHTML=`💪 TIDAK APA-APA, COBA LAGI!<br>Jawaban benar: <b>${q.correct}</b><br><small>${q.explain}</small>`;say('Tidak apa-apa, terus belajar. '+q.explain);tone(260,.16)}stats.answered++;updateHUD();$('#nextQuestion').classList.remove('hidden');}
$('#nextQuestion').onclick=()=>{closeModal('questionModal');currentQ++;if(currentQ>=questionList.length){finishLevel()}else{$('#questText').textContent=['Kamu hebat! Temukan tantangan berikutnya!','Terus jelajahi dunia ilmu!','Satu langkah lagi menuju hadiah!'][Math.floor(Math.random()*3)];if(worldObjects.length)worldObjects.forEach((o,i)=>{if(o.userData&&o.userData.kind==='crystal'&&i===currentQ)o.position.x=playerX+4});locked=false}};
function finishLevel(){clearInterval(timer);$('#finalStars').textContent=stats.stars;$('#finalCoins').textContent=stats.coins;$('#finalPoints').textContent=stats.points;$('#resultTitle').textContent=stats.correct>=8?'🏆 JUARA ILMU!':'🎉 LEVEL SELESAI!';$('#resultMessage').textContent=stats.correct>=8?'Luar biasa! Kamu menguasai tantangan ini!':'Petualangan hebat! Terus berlatih agar makin pintar.';let scores=cfg.players.map((name,i)=>({name,points:Math.max(0,Math.round(stats.points/cfg.players.length+(i===cfg.turn%cfg.players.length?Math.random()*10:0))),stars:Math.ceil(stats.stars/cfg.players.length)})).sort((a,b)=>b.points-a.points);$('#leaderboard').innerHTML=cfg.mode==='solo'?'':`<h3>🏅 Papan Skor Pemain</h3>`+scores.map((p,i)=>`<div class="leader-row"><span>${i+1}. ${p.name}</span><span>${p.points} poin · ⭐ ${p.stars}</span></div>`).join('');$('#resultModal').classList.remove('hidden');say('Selamat! Kamu telah menyelesaikan level.');if(threeReady)spawnCelebration();try{localStorage.setItem('petualanganIlmuProgress',JSON.stringify({kelas:cfg.kelas,subject:cfg.subject,stats,when:new Date().toISOString()}))}catch(e){}}
function resetLevel(){currentQ=0;questionList=buildQuestions();stats.answered=stats.correct=stats.wrong=0;stats.points=stats.coins=stats.stars=0;updateHUD();if(player){playerX=0;player.position.x=0}worldObjects.forEach(o=>{if(o.userData&&o.userData.kind==='crystal')o.visible=true});$('#questText').textContent='Temukan kristal ilmu dan selesaikan tantangan!';}
function pauseGame(){if(!$('#gameScreen').classList.contains('hidden'))$('#pauseModal').classList.remove('hidden');clearInterval(timer)}
function resumeGame(){closeModal('pauseModal');if(!$('#questionModal').classList.contains('hidden'))return}
function goHome(){clearInterval(timer);closeModal('pauseModal');closeModal('questionModal');closeModal('resultModal');$('#gameScreen').classList.add('hidden');$('#homeScreen').classList.remove('hidden');if(animId)cancelAnimationFrame(animId);if(renderer){renderer.dispose();renderer.domElement.remove()}scene=null;renderer=null;threeReady=false}
function initWorld(){
if(!window.THREE){alert('Three.js belum termuat. Periksa koneksi internet lalu muat ulang.');return}
const T=THREE,canvas=$('#worldCanvas');scene=new T.Scene();scene.background=new T.Color('#83d8ff');scene.fog=new T.Fog('#83d8ff',24,90);camera=new T.PerspectiveCamera(55,innerWidth/innerHeight,.1,150);camera.position.set(0,7,13);renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;clock=new T.Clock();worldObjects=[];
scene.add(new T.HemisphereLight(0xdaf6ff,0x4d7840,2));const sun=new T.DirectionalLight(0xfff1ce,3);sun.position.set(-7,13,7);sun.castShadow=true;scene.add(sun);
const mat=(color,rough=.82)=>new T.MeshStandardMaterial({color,roughness:rough});
function box(x,y,z,sx,sy,sz,color,opts={}){let m=new T.Mesh(new T.BoxGeometry(sx,sy,sz),mat(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);if(opts.kind)m.userData.kind=opts.kind;return m}
function sphere(x,y,z,r,color,opts={}){let m=new T.Mesh(new T.SphereGeometry(r,20,16),mat(color));m.position.set(x,y,z);m.castShadow=true;scene.add(m);if(opts.kind)m.userData.kind=opts.kind;return m}
const floor= new T.Mesh(new T.PlaneGeometry(180,24),mat('#75c957'));floor.rotation.x=-Math.PI/2;floor.position.set(0,-.18,-3);floor.receiveShadow=true;scene.add(floor);
for(let i=-8;i<25;i++){let x=i*3.8;box(x,-.02,-2.4,3.3,.24,4.2,i%2?'#c89a62':'#d7b176');sphere(x,.1,-5.5,.5,i%2?'#62bf49':'#8bd65a');}
for(let i=0;i<15;i++){let x=(i-3)*5;const trunk=box(x,1,-9,.55,2,.55,'#87502b');sphere(x,2.6,-9,1.5,['#42b94f','#6bcf54','#2c9b54'][i%3]);sphere(x+.7,2.9,-8.8,.8,'#65d85a')}
for(let i=0;i<8;i++){let x=i*5-5;box(x,1.1,-7,2,2,2,['#ffcb52','#ff8a56','#79d8ed'][i%3]);const roof=new T.Mesh(new T.ConeGeometry(1.7,.9,4),mat('#d95046'));roof.position.set(x,2.55,-7);roof.rotation.y=Math.PI/4;scene.add(roof)}
// Floating islands and clouds
for(let i=0;i<7;i++){let x=-10+i*4.8,z=-13-(i%3)*3;const rock=new T.Mesh(new T.ConeGeometry(1.5,2.5,6),mat('#8caa75'));rock.position.set(x,4+(i%2),z);rock.rotation.x=Math.PI;scene.add(rock);sphere(x,5+(i%2),z,.95,'#65c84b');}
for(let i=0;i<13;i++){let x=-20+i*3.5,y=7+(i%3)*.7;for(let j=0;j<3;j++)sphere(x+j*.55,y+(j%2)*.3,-20,.7,'#f8fdff')}
player=new T.Group();scene.add(player);
const body=new T.Mesh(new T.CapsuleGeometry(.42,.8,4,8),mat('#168fe5'));body.position.y=1.2;body.castShadow=true;player.add(body);
const head=sphere(0,2.05,0,.42,'#f7bf91');head.scale.set(1,1.05,.9);player.add(head);
const hair=sphere(0,2.33,-.04,.43,'#58321e');hair.scale.set(1,.52,1);player.add(hair);
const cap=new T.Mesh(new T.SphereGeometry(.46,16,8,0,Math.PI*2,0,Math.PI/2),mat('#e44b42'));cap.position.set(0,2.43,.02);player.add(cap);
const face1=sphere(-.14,2.08,.36,.055,'#30241c'),face2=sphere(.14,2.08,.36,.055,'#30241c');player.add(face1,face2);
const armL=box(-.52,1.35,0,.18,.62,.2,'#f7bf91'),armR=box(.52,1.35,0,.18,.62,.2,'#f7bf91');player.add(armL,armR);
const legL=box(-.2,.45,0,.24,.55,.28,'#214eaa'),legR=box(.2,.45,0,.24,.55,.28,'#214eaa');player.add(legL,legR);
player.position.set(0,0,0);playerX=0;
for(let i=0;i<10;i++){let x=4+i*4.3,z=-.2;const geo=new T.OctahedronGeometry(.65);const crystal=new T.Mesh(geo,new T.MeshStandardMaterial({color:i===9?'#ffbd26':'#35e9f6',emissive:i===9?'#b36b00':'#087a9b',emissiveIntensity:.7,metalness:.2,roughness:.25}));crystal.position.set(x,1.1,z);crystal.castShadow=true;crystal.userData={kind:'crystal',index:i};scene.add(crystal);worldObjects.push(crystal);const ring=new T.Mesh(new T.TorusGeometry(.8,.07,8,24),mat('#fff2a0'));ring.rotation.x=Math.PI/2;ring.position.set(x,.3,z);scene.add(ring);worldObjects.push(ring);
if(i%2===0){const chest=box(x+1.4,.35,-1,.9,.65,.7,'#a85c22');box(x+1.4,.57,-1,.94,.16,.74,'#f3b72e');}
}
for(let i=0;i<16;i++){let x=i*3-6;const coin=new T.Mesh(new T.TorusGeometry(.22,.08,8,16),mat('#ffdc38'));coin.position.set(x,.8,1.2);coin.rotation.y=Math.PI/2;coin.userData={kind:'coin',taken:false};scene.add(coin);worldObjects.push(coin)}
// Friendly sign post
box(-4,1.2,-1.2,.18,2.4,.18,'#86512b');const sign=box(-4,2.05,-1.2,2.3,.8,.15,'#b77a36');sign.userData={kind:'npc'};worldObjects.push(sign);
// decorative stream
const water=new T.Mesh(new T.PlaneGeometry(10,5),new T.MeshStandardMaterial({color:'#36c9ef',roughness:.18,metalness:.12}));water.rotation.x=-Math.PI/2;water.position.set(12,-.08,-7);scene.add(water);
threeReady=true;window.addEventListener('resize',resizeWorld);if(animId)cancelAnimationFrame(animId);animate();
}
function resizeWorld(){if(!renderer||!camera)return;camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}
function animate(){animId=requestAnimationFrame(animate);if(!renderer||!scene)return;const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
if(player){let dir=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0);dir+=moveDir;dir=Math.max(-1,Math.min(1,dir));playerX+=dir*dt*5;playerX=Math.max(-4,Math.min(38,playerX));player.position.x=playerX;if(dir){player.rotation.y=dir>0?0:Math.PI;player.children[6].rotation.z=Math.sin(t*12)*.5;player.children[7].rotation.z=-Math.sin(t*12)*.5;player.children[8].rotation.x=Math.sin(t*12)*.55;player.children[9].rotation.x=-Math.sin(t*12)*.55}else{player.children[6].rotation.z=0;player.children[7].rotation.z=0;player.children[8].rotation.x=0;player.children[9].rotation.x=0}
if(jumping){velocityY-=18*dt;player.position.y+=velocityY*dt;if(player.position.y<=0){player.position.y=0;velocityY=0;jumping=false;onGround=true}}camera.position.x+=(playerX-camera.position.x)*Math.min(1,dt*3);camera.lookAt(playerX,1,-4);
for(const o of worldObjects){if(!o.visible)continue;if(o.userData.kind==='crystal'){o.rotation.y+=dt*1.5;o.position.y=1.1+Math.sin(t*2+o.userData.index)*.15;const dx=Math.abs(o.position.x-playerX);if(dx<1.4){nearObject=o;$('#interactPrompt').classList.remove('hidden')} }else if(o.userData.kind==='coin'&&!o.userData.taken){o.rotation.y+=dt*2.5;o.position.y=.8+Math.sin(t*3+o.position.x)*.13;if(Math.abs(o.position.x-playerX)<.65){o.userData.taken=true;o.visible=false;stats.coins++;stats.points+=2;updateHUD();tone(980,.06)}}}
if(!worldObjects.some(o=>o.userData.kind==='crystal'&&o.visible&&Math.abs(o.position.x-playerX)<1.4)){$('#interactPrompt').classList.add('hidden');nearObject=null}
}
renderer.render(scene,camera)}
function spawnCelebration(){if(!scene)return;for(let i=0;i<35;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.08,8,8),new THREE.MeshBasicMaterial({color:['#ffcf32','#28d6ff','#ff65c8','#7dff5b'][i%4]}));m.position.set(playerX+(Math.random()-.5)*8,2+Math.random()*5,-3-Math.random()*5);scene.add(m);setTimeout(()=>scene&&scene.remove(m),1800)}}
function jump(){if(onGround){jumping=true;onGround=false;velocityY=7;tone(380,.07)}}
function interact(){if(!$('#gameScreen').classList.contains('hidden')&&$('#questionModal').classList.contains('hidden')){if(nearObject||playerX>1){openQuestion()}else{say('Ayo dekati kristal ilmu yang bercahaya!');tone(320)}}}
window.addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowLeft','ArrowRight','ArrowUp'].includes(e.code))e.preventDefault();if(e.code==='Space'||e.code==='ArrowUp')jump();if(e.code==='KeyE'||e.code==='Enter')interact();if(e.code==='Escape')pauseGame()});
window.addEventListener('keyup',e=>keys[e.code]=false);
$$('[data-control]').forEach(b=>{const ctl=b.dataset.control;const down=e=>{e.preventDefault();tone(500,.04);if(ctl==='left')moveDir=-1;if(ctl==='right')moveDir=1;if(ctl==='jump')jump();if(ctl==='interact')interact()};const up=e=>{e.preventDefault();if((ctl==='left'&&moveDir<0)||(ctl==='right'&&moveDir>0))moveDir=0};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up)});
})();
