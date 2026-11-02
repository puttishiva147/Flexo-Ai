/* Offline built-in response layer. Independent from imported user data. */
(function(w){"use strict";
var facts={
lion:"A lion is a large wild cat found mainly in Africa, with a small population in India’s Gir Forest. Lions live in groups called prides. They are carnivores, and females often do much of the hunting.",
tiger:"A tiger is the largest living cat. It has a striped coat, is usually solitary, and is an excellent swimmer. Tigers are carnivores found in parts of Asia. Each tiger’s stripe pattern is unique.",
elephant:"An elephant is the largest land animal. Its trunk helps it breathe, smell, drink, pick up objects, and communicate. Elephants are herbivores and live in family groups.",
dolphin:"A dolphin is an intelligent marine mammal. It breathes air through a blowhole, uses sound to communicate and find objects, and often lives in a social group called a pod.",
whale:"A whale is a marine mammal, not a fish. Whales breathe air with lungs, are warm-blooded, and feed their young milk. Some eat tiny krill while others catch fish or squid.",
shark:"A shark is a fish with a skeleton made mostly of cartilage. Sharks breathe through gills and have several rows of teeth. Most species are not dangerous to people.",
eagle:"An eagle is a bird of prey with excellent eyesight, strong feet, and hooked claws called talons. Eagles hunt fish, birds, or small mammals depending on the species.",
penguin:"A penguin is a flightless seabird adapted for swimming. Its wings work like flippers, and dense feathers help keep it warm. Penguins live naturally in the Southern Hemisphere.",
giraffe:"A giraffe is the tallest living land animal. Its long neck helps it reach leaves high in trees, and its spotted coat helps it blend into its surroundings.",
wolf:"A wolf is a wild member of the dog family. Wolves are social animals that often live in family groups and communicate through sounds, scent, and body language.",
fox:"A fox is a small-to-medium member of the dog family. Foxes are adaptable and often eat small animals, insects, fruit, and other foods.",
bear:"A bear is a large mammal with a strong sense of smell. Different bear species eat plants, insects, fish, and meat.",
rabbit:"A rabbit is a small herbivorous mammal with long ears, powerful hind legs, and continuously growing teeth. Rabbits eat grasses and other plants.",
cat:"A domestic cat is a small carnivorous mammal. Cats have sharp senses, retractable claws, whiskers that help judge spaces, and flexible bodies.",
dog:"A domestic dog is a social mammal descended from ancient wolf populations. Dogs use scent, body language, and sounds to communicate.",
horse:"A horse is a hoofed herbivorous mammal. Horses are strong runners, live in social groups, and communicate through sounds, posture, and facial expressions.",
cow:"A cow is a domesticated ruminant. Its multi-chambered stomach helps it digest grass and other plants. Cattle are raised for several agricultural purposes.",
bee:"A bee is a flying insect. Many bees pollinate flowers while collecting nectar and pollen. Honeybees live in colonies, but most bee species are solitary.",
butterfly:"A butterfly is an insect with four large, often colourful wings. It develops through four stages: egg, caterpillar, pupa, and adult.",
snake:"A snake is a legless reptile. Snakes use their tongues to collect scent particles and swallow food whole. Most snakes avoid people.",
crocodile:"A crocodile is a large semi-aquatic reptile with powerful jaws, a long tail, and eyes and nostrils positioned high on its head. It is an ambush predator.",
octopus:"An octopus is a sea animal with eight arms, a soft body, and remarkable problem-solving abilities. It can change colour and texture to camouflage itself.",
owl:"An owl is a bird of prey adapted for hunting, often at night. Many owls have excellent hearing, forward-facing eyes, and feathers that help them fly quietly.",
monkey:"A monkey is a primate with grasping hands and forward-facing eyes. Many monkeys live in social groups and eat fruit, leaves, seeds, and insects.",
gorilla:"A gorilla is a large, mostly plant-eating ape native to forests in central Africa. Gorillas live in family groups and communicate through sounds and gestures.",
kangaroo:"A kangaroo is a marsupial from Australia. It moves by powerful hopping and carries its very young joey in a pouch.",
panda:"A giant panda is a bear native to China. It eats mostly bamboo and uses an enlarged wrist bone like a thumb to grip bamboo.",
cheetah:"A cheetah is a large cat built for speed. It accelerates very quickly over short distances and hunts mainly by chasing prey in open habitats.",
leopard:"A leopard is a strong, adaptable big cat with a spotted coat. It is an excellent climber and often rests or stores food in trees.",
deer:"A deer is a hoofed herbivorous mammal. Many male deer grow and shed antlers each year, although female reindeer can also have antlers.",
ant:"An ant is a social insect that lives in organised colonies. Ants communicate using chemical signals called pheromones and work together to find food."
};
var alias={lions:"lion",tigers:"tiger",elephants:"elephant",dolphins:"dolphin",whales:"whale",sharks:"shark",eagles:"eagle",penguins:"penguin",giraffes:"giraffe",wolves:"wolf",foxes:"fox",bears:"bear",rabbits:"rabbit",bunnies:"rabbit",cats:"cat",dogs:"dog",horses:"horse",cows:"cow",cattle:"cow",bees:"bee",butterflies:"butterfly",snakes:"snake",crocodiles:"crocodile",alligators:"crocodile",octopuses:"octopus",octopi:"octopus",owls:"owl",monkeys:"monkey",gorillas:"gorilla",kangaroos:"kangaroo",pandas:"panda",cheetahs:"cheetah",leopards:"leopard",deer:"deer",ants:"ant"};
var topics={
earth:"Earth is the planet we live on. It has land, oceans, and an atmosphere that supports life. Earth travels around the Sun once each year and rotates about once every 24 hours.",
sun:"The Sun is the star at the centre of our solar system. It gives Earth light and heat, and its gravity keeps the planets in orbit.",
moon:"The Moon is Earth’s natural satellite. It reflects sunlight, orbits Earth, and its gravity helps cause ocean tides.",
photosynthesis:"Photosynthesis is the process plants use to make food. They use light energy, water, and carbon dioxide to produce sugars and release oxygen.",
gravity:"Gravity is an attractive force between objects that have mass. On Earth, it pulls objects toward the planet and helps keep the Moon and satellites in orbit.",
watercycle:"The water cycle is the continuous movement of water between Earth’s surface and the atmosphere. It includes evaporation, condensation, precipitation, and collection.",
solarsystem:"Our solar system includes the Sun, eight planets, their moons, dwarf planets, asteroids, and comets. The planets orbit the Sun because of gravity.",
ocean:"An ocean is a huge body of salty water. Oceans cover most of Earth’s surface, influence weather and climate, and provide habitats for many forms of life.",
volcano:"A volcano is an opening in Earth’s crust through which molten rock, ash, and gases can escape. Molten rock below the surface is magma; at the surface it is lava.",
electricity:"Electricity is related to the presence and movement of electric charge. It powers lights, appliances, computers, and many other devices.",
ecosystem:"An ecosystem is a community of living things interacting with one another and with non-living parts of their environment, such as water, soil, air, and sunlight.",
computer:"A computer is an electronic device that receives input, processes information according to instructions, stores data, and produces output.",
india:"India is a country in South Asia. Its capital is New Delhi, and it has many languages, cultures, and landscapes.",
dna:"DNA is the molecule that carries hereditary instructions in living organisms. It contains information that helps cells grow, function, and reproduce.",
planet:"A planet is a large, nearly round object that orbits a star and has cleared most other objects from its orbital neighbourhood. Earth is one of the eight planets in our solar system.",
water:"Water is a clear substance made of hydrogen and oxygen. It is essential for life and exists naturally as a solid (ice), liquid, and gas (water vapour)."
};
function norm(s){return String(s||"").toLowerCase().replace(/[’']/g,"").replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim()}
function any(q,a){return a.some(function(x){return q.indexOf(x)!==-1})}
function out(type,text){return {type:type,text:text}}
function respond(input){
var q=norm(input);if(!q)return null;
if(/^(hi|hii+|hello|hey|heyy+|hiya|namaste|good morning|good afternoon|good evening|howdy)( flexo)?$/.test(q)||/^(hi|hello|hey|namaste) (there|flexo)$/.test(q))return out("conversation","Hey! 👋 I’m Flexo. What would you like to explore today?");
if(any(q,["what is your name","who are you","are you flexo"]))return out("conversation","I’m Flexo, your personal assistant. I can answer common questions and search your Knowledge Library.");
if(any(q,["who created you","who made you","who owns you"]))return out("app","Flexo AI was created by Shiva Putti, the project owner and developer.");
if(any(q,["how are you","how r u","kaise ho","kya haal"]))return out("conversation","I’m doing well and ready to help. How’s your day going?");
if(any(q,["thank you","thanks","thx","shukriya","dhanyavad"]))return out("conversation","You’re welcome! 😊 I’m here whenever you need a hand.");
if(/^(bye|goodbye|see you|see ya|take care|good night)$/.test(q))return out("conversation","See you soon! Take care. 👋");
if(any(q,["who created flexo","who made flexo","who built flexo","who is the owner of flexo","who owns flexo","flexo owner","creator of flexo","developer of flexo","who developed flexo","who is behind flexo"]))return out("app","Flexo AI was created by Shiva Putti, the project owner and developer.");
if(any(q,["what is flexo","what is flexo ai","about flexo","tell me about flexo","what can flexo do","what does flexo do"]))return out("app","Flexo AI is a personal assistant with built-in knowledge for common questions and a Knowledge Library for your imported files and notes. It can answer everyday questions and search relevant passages from your library.");
if(any(q,["what can you do","your features","your capabilities","how can you help","help me use flexo"]))return out("conversation","I can answer common questions, explain basic topics, chat with you, and search your imported Knowledge Library when it contains relevant information. You can also import conversation exports and save notes for later.");
if(any(q,["do you save my data","where is my data stored","where do you store my data","are you collecting my data","do you collect my data","is my data private"]))return out("app","Your imported Knowledge Library is stored in this app on your device. Chat history is saved on this device when Save chat history is enabled. You can review the export and delete controls in Settings.");
// In-app product guidance. These instructions describe controls that exist in this build.
// Provider-specific export questions should point users to the matching in-app import card.
if(any(q,["export from chatgpt","export chatgpt data","download my chatgpt data","export from claude","export claude data","export from gemini","export gemini data","export from deepseek","export deepseek data"]))return out("guide","To bring conversations from another service into Flexo:\n1. Open Flexo Settings.\n2. Under Import existing conversations, open the matching service card (ChatGPT, Claude, Gemini, or DeepSeek).\n3. Follow the export instructions shown there in that service.\n4. Return to Flexo, tap Choose file, and select the downloaded export.\n\nFlexo cannot access your other account or request the export for you.");
if(any(q,["import chats from chatgpt","import chatgpt conversations","import conversations","how do i import","how to import","how can i import","bring my old chats","upload a conversation export","import claude","import gemini","import deepseek"]))return out("guide","To import an existing conversation export:\n1. Open Settings.\n2. Under Import existing conversations, tap the service or export type you want to import.\n3. Read the on-screen export instructions, then tap Choose file.\n4. Select the downloaded ZIP, JSON, TXT, MD, CSV, or HTML file. ZIP exports are searched for conversation JSON files.\n5. Wait for the Imported confirmation. Your imported conversations are added to the Knowledge Library and can be searched in chat.\n\nFlexo cannot sign in to another service or download its export for you.");
if(any(q,["how do i export","how to export","how can i export","export my flexo","export my data","export chats","export chat history","backup my data","download my data","save my data as a file","make a backup"]))return out("guide","To export your Flexo data:\n1. Open Settings.\n2. Find General.\n3. Tap Export data.\n4. On Android, choose where to save the file in the system save dialog and confirm. In a web browser, the JSON file downloads through the browser.\n\nThe file is named flexo-data.json and contains your current chats, Knowledge Library entries, and settings. Keep a copy somewhere safe. Exporting does not delete anything from Flexo.");
if(any(q,["where is my export","where did my export go","where is the exported file","where is my backup","where are downloads saved"]))return out("guide","When you export from the Android app, Flexo opens the system Save dialog. The file is saved in the folder you choose; check that location in your Files app. In a web browser, check the browser’s Downloads list or Downloads folder.");
if(any(q,["restore my backup","restore flexo data","import flexo backup","how do i restore","how to restore"]))return out("guide","To restore a Flexo backup, open Settings → General → Restore backup, choose your flexo-data.json file, and wait for the restore confirmation. Flexo validates the backup before replacing local chats, knowledge and settings. If validation or saving fails, your existing data is kept.");
if(any(q,["how do i add knowledge","how to add knowledge","how do i add a knowledge file","how do i upload a knowledge file","how to upload files","how can i upload a file","how do i add files","upload knowledge","add a file","add files","upload a file","add notes","write notes","add to knowledge library"]))return out("guide","To add information to your Knowledge Library:\n1. Open Knowledge.\n2. Tap Add files and choose TXT, MD, CSV, JSON, HTML, XML, LOG, RTF, DOCX, XLSX or PPTX files.\n3. Or tap Write manually to save notes.\n4. Wait for the import confirmation, then ask Flexo a question about the imported information.\n\nFlexo extracts supported text locally and searches relevant passages. PDF extraction is not available in this build.");
if(any(q,["what file types","which file formats","supported file formats","what files can i upload","which files can i upload","file types supported","file format","file formats","supported formats","what formats can i use"]))return out("guide","Knowledge Library import supports TXT, MD, CSV, JSON, HTML, HTM, XML, LOG, RTF, DOCX, XLSX and PPTX. DOCX, XLSX and PPTX text is extracted locally. PDF is not supported yet. Conversation export import separately supports recognised ZIP/JSON/TXT/MD/CSV/HTML exports.");
if(any(q,["what is a knowledge pack","how do knowledge packs work","make a knowledge pack","create a knowledge pack"]))return out("guide","A Knowledge Pack is a prepared set of notes about information you want Flexo to know. Open Knowledge → Knowledge Pack prompt, copy the prompt, prepare your notes, then add the resulting TXT, MD, CSV, or JSON file to your Knowledge Library.");
if(any(q,["how do i save chats","save chat history","keep my chat history","where are my chats saved","chat history setting"]))return out("guide","To keep chat history on this device, open Settings → General and turn on Save chat history. Open History to see saved conversations. If you turn this setting off, chats are no longer written to saved local history. You can still use the current chat while the app session is open.");
if(any(q,["how do i start a new chat","new conversation","start new chat","clear this chat"]))return out("guide","Tap New chat at the top of the chat screen. Your previous conversation remains in History when Save chat history is enabled.");
if(any(q,["turn on knowledge","turn off knowledge","enable knowledge library","disable knowledge library","knowledge search setting"]))return out("guide","Open Settings → General. Use Use my knowledge library to turn searching your imported files on or off. Your imported files are not deleted when you switch searching off.");
if(any(q,["delete my data","delete all my data","clear all data","remove all my chats and knowledge"]))return out("guide","To delete all Flexo data, open Settings → General → Delete all data. Tap Delete once, then tap Tap again to confirm. This removes saved chats, Knowledge Library entries, and settings from this app. Export a backup first if you may need the information later.");
if(any(q,["how do i use flexo","show me how to use flexo","guide me","help me get started","how does this app work","how to use this app","what should i do first"]))return out("guide","Here’s a quick Flexo tour:\n1. Chat: ask a question or choose a suggested prompt.\n2. Knowledge: add TXT, MD, CSV, or JSON files, or write notes manually.\n3. Tools: open a ready-made task prompt.\n4. History: reopen saved chats when Save chat history is enabled.\n5. Settings: import conversation exports, export your Flexo data, control chat history, and manage privacy options.\n\nYou can ask me how to do any one of these things, and I’ll walk you through it.");

if(any(q,["tell me about animals","what are animals","animal kingdom","types of animals","different kinds of animals","about animals"]))return out("knowledge","Animals are living organisms that need energy, grow, respond to their surroundings, and reproduce. They include mammals, birds, reptiles, amphibians, fish, and invertebrates such as insects and octopuses. Animals live in forests, grasslands, oceans, deserts, and many other habitats. Some eat plants, some eat other animals, and some eat both.");
var prefixes=["tell me about ","what is a ","what is an ","what is the ","what is ","what are ","who is a ","who is an ","describe ","explain ","facts about ","information about ","information on ","learn about ","teach me about ","give me facts about ","i want to know about ","can you tell me about ","do you know about "],name="";
for(var i=0;i<prefixes.length;i++)if(q.indexOf(prefixes[i])===0){name=q.slice(prefixes[i].length);break}
if(!name&&/^(lion|tiger|elephant|dolphin|whale|shark|eagle|penguin|giraffe|wolf|fox|bear|rabbit|cat|dog|horse|cow|bee|butterfly|snake|crocodile|octopus|owl|monkey|gorilla|kangaroo|panda|cheetah|leopard|deer|ant)s?$/.test(q))name=q;
name=name.replace(/^(a|an|the) /,"").replace(/\?+$/,"").replace(/\s+(animal|animals|species|please|in detail)$/,"").trim();
if(name){var key=alias[name]||name;if(facts[key])return out("knowledge",facts[key]);var topic=name.replace(/[^a-z]/g,"");if(topics[topic])return out("knowledge",topics[topic])}
if(any(q,["what is photosynthesis","explain photosynthesis","how do plants make food"]))return out("knowledge",topics.photosynthesis);
if(any(q,["what is gravity","explain gravity","why do things fall"]))return out("knowledge",topics.gravity);
if(any(q,["what is the water cycle","explain the water cycle"]))return out("knowledge",topics.watercycle);
if(any(q,["what is the solar system","explain the solar system"]))return out("knowledge",topics.solarsystem);
if(any(q,["what is dna","what does dna mean"]))return out("knowledge",topics.dna);
if(any(q,["what is a computer","what is computer"]))return out("knowledge",topics.computer);
if(any(q,["what is electricity"]))return out("knowledge",topics.electricity);
if(any(q,["what is an ecosystem","what is ecosystem"]))return out("knowledge",topics.ecosystem);
return null
}
w.FlexoBuiltin={respond:respond};
})(window);

/* Lex Beta — in-app Pika H3 Flex workspace. Loaded with the existing Flexo UI. */
(function(w,d){
"use strict";
function boot(){
  if(d.getElementById("lexScreen"))return;
  var css=d.createElement("style");
  css.textContent=[
    "#lexScreen{max-width:1120px;padding:18px 16px 34px;color:#f4f0e8}",
    "#lexScreen .lex-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}",
    "#lexScreen .lex-mark{display:flex;align-items:center;gap:10px}",
    "#lexScreen .lex-mark-icon{width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:#e8cda3;color:#17120c;font-size:21px;font-weight:900}",
    "#lexScreen .lex-beta{font-size:10px;letter-spacing:.16em;border:1px solid #806c4d;color:#e8cda3;border-radius:99px;padding:5px 9px}",
    "#lexScreen .lex-sub{color:#a69e8f;font-size:13px;margin:2px 0 0}",
    "#lexScreen .lex-layout{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(260px,.75fr);gap:14px;align-items:start}",
    "#lexScreen .lex-panel{background:linear-gradient(160deg,#19181b,#101012);border:1px solid #302b23;border-radius:18px;padding:16px;min-width:0}",
    "#lexScreen .lex-label{display:block;font-size:12px;color:#b6aa98;margin:0 0 7px;letter-spacing:.04em}",
    "#lexScreen .lex-prompt{width:100%;min-height:132px;resize:vertical;background:#09090b;color:#f7f2e8;border:1px solid #383127;border-radius:13px;padding:13px;font:inherit;line-height:1.5}",
    "#lexScreen .lex-modes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-bottom:16px}",
    "#lexScreen .lex-mode{border:1px solid #373127;background:#111114;border-radius:11px;padding:10px;text-align:left;color:#c8c0b3;font-size:12px;min-height:48px}",
    "#lexScreen .lex-mode.active{border-color:#d9bd91;background:#282117;color:#f3d9b4}",
    "#lexScreen .lex-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:14px 0}",
    "#lexScreen .lex-field select,#lexScreen .lex-field input{width:100%;background:#09090b;border:1px solid #383127;border-radius:10px;padding:10px;color:#f7f2e8;font:inherit;font-size:13px}",
    "#lexScreen .lex-upload{display:block;border:1px dashed #62513a;border-radius:13px;padding:13px;background:#111114;margin:9px 0;color:#c9bdac;font-size:12px}",
    "#lexScreen .lex-upload input{display:block;width:100%;margin-top:8px;font-size:12px}",
    "#lexScreen .lex-generate{width:100%;padding:14px;border-radius:99px;background:linear-gradient(135deg,#f1dfc2,#c7a678);color:#19130b;font-weight:800;margin-top:8px}",
    "#lexScreen .lex-generate:disabled{opacity:.45}",
    "#lexScreen .lex-status{font-size:12px;color:#c7b18e;min-height:22px;margin-top:10px;overflow-wrap:anywhere}",
    "#lexScreen .lex-preview{aspect-ratio:16/9;background:#08080a;border:1px solid #302b23;border-radius:14px;display:grid;place-items:center;overflow:hidden;color:#8e877b;text-align:center;padding:12px}",
    "#lexScreen .lex-preview video{width:100%;height:100%;object-fit:contain;background:#000}",
    "#lexScreen .lex-connect{margin-top:14px;border-top:1px solid #302b23;padding-top:12px}",
    "#lexScreen .lex-connect summary{color:#c9b99f;font-size:12px;cursor:pointer}",
    "#lexScreen .lex-connect input{width:100%;margin-top:8px;background:#09090b;color:#f7f2e8;border:1px solid #383127;border-radius:9px;padding:10px;font:inherit;font-size:12px}",
    "#lexScreen .lex-note{font-size:11px;color:#898174;line-height:1.5;margin-top:10px}",
    "#lexScreen .lex-history{display:flex;flex-direction:column;gap:8px;margin-top:12px}",
    "#lexScreen .lex-history-item{padding:10px;border:1px solid #302b23;border-radius:11px;background:#111114;font-size:12px;color:#d6cbb9}",
    "#lexScreen .lex-download{display:inline-block;color:#e8cda3;font-size:12px;margin-top:10px;text-decoration:underline}",
    "@media(max-width:720px){#lexScreen .lex-layout{grid-template-columns:1fr}#lexScreen .lex-fields{grid-template-columns:repeat(2,minmax(0,1fr))}#lexScreen{padding:14px 12px 28px}}",
    "@media(max-width:380px){#lexScreen .lex-fields{grid-template-columns:1fr}#lexScreen .lex-panel{padding:12px}}"
  ].join("\n");
  d.head.appendChild(css);

  var section=d.createElement("section");
  section.className="s";
  section.id="lexScreen";
  section.innerHTML=[
    "<div class='lex-head'><div class='lex-mark'><div class='lex-mark-icon'>L</div><div><h1 style='margin:0;font-size:28px;letter-spacing:-.04em'>Lex</h1><p class='lex-sub'>Cinematic video creation inside Flexo AI</p></div></div><span class='lex-beta'>BETA</span></div>",
    "<div class='lex-layout'>",
    "<div class='lex-panel'><span class='lex-label'>GENERATION MODE</span><div class='lex-modes' id='lexModes'>",
    "<button class='lex-mode active' data-mode='t2va'>Text to Video</button><button class='lex-mode' data-mode='i2va'>Image to Video</button><button class='lex-mode' data-mode='fl2va'>First + Last Frame</button><button class='lex-mode' data-mode='ref2va'>Reference Guided</button>",
    "</div><label class='lex-label' for='lexPrompt'>DESCRIBE YOUR VIDEO</label><textarea id='lexPrompt' class='lex-prompt' maxlength='8000' placeholder='Describe the scene, camera movement, subject action, lighting, atmosphere and sound...'></textarea>",
    "<div id='lexUploads'></div>",
    "<div class='lex-fields'><label class='lex-field'><span class='lex-label'>RESOLUTION</span><select id='lexResolution'><option value='480p'>480p · Draft</option><option value='768p'>768p · High</option></select></label><label class='lex-field'><span class='lex-label'>ASPECT RATIO</span><select id='lexAspect'><option>16:9</option><option>9:16</option><option>1:1</option><option>4:3</option><option>3:2</option><option>21:9</option><option>4:5</option><option>3:4</option><option>2:3</option><option>5:4</option><option>9:21</option></select></label><label class='lex-field'><span class='lex-label'>DURATION</span><select id='lexDuration'><option value='5'>5 seconds</option><option value='6'>6 seconds</option><option value='8'>8 seconds</option><option value='10'>10 seconds</option><option value='12'>12 seconds</option><option value='15'>15 seconds</option></select></label></div>",
    "<button id='lexGenerate' class='lex-generate'>✦ Generate video</button><div id='lexStatus' class='lex-status' role='status' aria-live='polite'>Connect a GPU inference server to start generating.</div>",
    "<details class='lex-connect'><summary>Inference server connection</summary><label class='lex-label' style='margin-top:10px'>BACKEND HTTPS URL</label><input id='lexEndpoint' type='url' placeholder='https://your-gpu-server.example.com'><label class='lex-label' style='margin-top:10px'>ACCESS TOKEN (OPTIONAL)</label><input id='lexToken' type='password' autocomplete='off' placeholder='Your Lex backend access token'><p class='lex-note'>The model runs on a dedicated GPU server, not inside the phone or browser. Keep server secrets off the app. Your access token is stored only in this device’s local app storage.</p><button id='lexSaveConnection' class='lex-mode' style='width:100%;margin-top:8px'>Save connection</button><button id='lexTestConnection' class='lex-mode' style='width:100%;margin-top:8px'>Test backend connection</button></details>",
    "</div>",
    "<div class='lex-panel'><span class='lex-label'>YOUR VIDEO</span><div class='lex-preview' id='lexPreview'>Your generated video will appear here.</div><div id='lexVideoActions'></div><div class='lex-note'>Pika H3 Flex generates synchronized video and audio. Native output: 480p or 768p, 24 fps, 5–15 seconds.</div><div class='lex-connect'><span class='lex-label'>RECENT GENERATIONS</span><div class='lex-history' id='lexHistory'><span class='lex-note'>Your recent Lex jobs will appear here.</span></div></div></div>",
    "</div>",
    "<p class='lex-note' style='margin:14px 2px'>Powered by Pika H3 Flex · Open-weight model integration. Model adapters and MiniMax-H3 base components have separate license terms. See the repository’s lex-backend/README.md.</p>"
  ].join("");
  var screens=d.querySelector(".screens");
  if(!screens)return;
  screens.appendChild(section);

  function addNav(container){
    if(!container||container.querySelector("[data-id='lexScreen']"))return;
    var b=d.createElement("button");
    b.type="button";b.dataset.id="lexScreen";b.setAttribute("aria-label","Lex Beta");b.title="Lex Beta";
    b.innerHTML="<svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 16.5 10 4l3 6 2-3 5 9.5H4Z'/><path d='M8 16.5h8'/></svg><span>Lex</span>";
    var tools=container.querySelector("[data-id='tools']");
    if(tools&&tools.nextSibling)container.insertBefore(b,tools.nextSibling);else container.appendChild(b);
  }
  addNav(d.getElementById("sn"));addNav(d.getElementById("tb"));
  if(location.hash==="#lexScreen"&&typeof w.go==="function")w.go("lexScreen");

  var mode="t2va",currentVideoUrl=null,history=[];
  try{history=JSON.parse(localStorage.getItem("flexo_lex_history")||"[]")}catch(e){}
  function el(id){return d.getElementById(id)}
  function endpoint(){return (localStorage.getItem("flexo_lex_endpoint")||"").replace(/\/+$/,"")}
  function token(){return localStorage.getItem("flexo_lex_token")||""}
  function auth(){var h={};if(token())h.Authorization="Bearer "+token();return h}
  function setStatus(t){el("lexStatus").textContent=t}
  function uploads(){
    var box=el("lexUploads");box.innerHTML="";
    if(mode==="i2va"||mode==="fl2va"){
      box.innerHTML+="<label class='lex-upload'>FIRST FRAME · REQUIRED<input id='lexFirst' type='file' accept='image/*'></label>";
    }
    if(mode==="fl2va"){
      box.innerHTML+="<label class='lex-upload'>LAST FRAME · REQUIRED<input id='lexLast' type='file' accept='image/*'></label>";
    }
    if(mode==="ref2va"){
      box.innerHTML+="<label class='lex-upload'>REFERENCE IMAGES / VIDEOS · UP TO 12<input id='lexRefs' type='file' accept='image/*,video/*' multiple></label>";
    }
  }
  function renderHistory(){
    var box=el("lexHistory");box.innerHTML="";
    if(!history.length){box.textContent="Your recent Lex jobs will appear here.";return}
    history.slice(0,8).forEach(function(item){
      var row=d.createElement("div");row.className="lex-history-item";
      row.textContent=(item.status==="completed"?"✓ ":"• ")+item.prompt.slice(0,86);
      box.appendChild(row);
    });
  }
  el("lexModes").addEventListener("click",function(e){
    var b=e.target.closest("[data-mode]");if(!b)return;
    mode=b.dataset.mode;
    el("lexModes").querySelectorAll(".lex-mode").forEach(function(x){x.classList.toggle("active",x===b)});
    uploads();
  });
  uploads();renderHistory();
  el("lexEndpoint").value=endpoint();el("lexToken").value=token();
  el("lexSaveConnection").addEventListener("click",function(){
    var value=el("lexEndpoint").value.trim();
    if(value&&!/^https:\/\//i.test(value)){setStatus("Use an HTTPS backend URL.");return}
    localStorage.setItem("flexo_lex_endpoint",value);
    localStorage.setItem("flexo_lex_token",el("lexToken").value.trim());
    setStatus(value?"Backend connection settings saved on this device.":"Backend URL cleared.");
  });
  el("lexTestConnection").addEventListener("click",async function(){
    var base=endpoint();if(!base){setStatus("Enter and save your backend HTTPS URL first.");return}
    setStatus("Testing backend connection…");
    try{var response=await fetch(base+"/health",{headers:auth()});var data=await response.json();if(!response.ok||!data.ok)throw new Error("Backend health check failed");setStatus("Connected · "+data.model+" inference service is reachable.");}
    catch(error){setStatus("Backend connection failed: "+error.message)}
  });
  el("lexGenerate").addEventListener("click",async function(){
    var base=endpoint(),prompt=el("lexPrompt").value.trim(),button=el("lexGenerate");
    if(!base){setStatus("Add your GPU backend HTTPS URL in Inference server connection.");return}
    if(!prompt){setStatus("Write a video prompt first.");el("lexPrompt").focus();return}
    if((mode==="i2va"||mode==="fl2va")&&!el("lexFirst").files[0]){setStatus("Choose a first-frame image.");return}
    if(mode==="fl2va"&&!el("lexLast").files[0]){setStatus("Choose a last-frame image.");return}
    if(mode==="ref2va"&&(!el("lexRefs").files.length||el("lexRefs").files.length>12)){setStatus("Choose between 1 and 12 reference files.");return}
    var form=new FormData();
    form.append("prompt",prompt);form.append("mode",mode);
    form.append("resolution",el("lexResolution").value);form.append("aspect",el("lexAspect").value);
    form.append("duration",el("lexDuration").value);form.append("seed",String(Math.floor(Math.random()*2147483647)));
    if(mode==="i2va"||mode==="fl2va")form.append("first_image",el("lexFirst").files[0]);
    if(mode==="fl2va")form.append("last_image",el("lexLast").files[0]);
    if(mode==="ref2va")Array.from(el("lexRefs").files).forEach(function(file){form.append("reference_files",file)});
    button.disabled=true;setStatus("Submitting your generation request…");
    try{
      var response=await fetch(base+"/v1/jobs",{method:"POST",headers:auth(),body:form});
      var data=await response.json();if(!response.ok)throw new Error(data.detail||"Could not create generation job");
      setStatus("Job queued. Waiting for the GPU…");poll(data.id,base,button,prompt);
    }catch(error){setStatus("Connection error: "+error.message);button.disabled=false}
  });
  async function poll(id,base,button,prompt){
    var started=Date.now();
    async function tick(){
      try{
        var response=await fetch(base+"/v1/jobs/"+encodeURIComponent(id),{headers:auth()});
        var data=await response.json();if(!response.ok)throw new Error(data.detail||"Could not read job status");
        if(data.status==="queued"){setStatus("Queued · waiting for GPU capacity…")}
        else if(data.status==="running"){setStatus("Generating video and synchronized audio…")}
        else if(data.status==="failed"){throw new Error(data.error||"Generation failed")}
        else if(data.status==="completed"){
          setStatus("Video generated successfully.");
          var videoResponse=await fetch(base+data.video_url,{headers:auth()});
          if(!videoResponse.ok)throw new Error("Video is ready but could not be downloaded from the backend.");
          var blob=await videoResponse.blob();if(currentVideoUrl)URL.revokeObjectURL(currentVideoUrl);
          currentVideoUrl=URL.createObjectURL(blob);
          var video=d.createElement("video");video.controls=true;video.playsInline=true;video.src=currentVideoUrl;
          el("lexPreview").innerHTML="";el("lexPreview").appendChild(video);
          var link=d.createElement("a");link.className="lex-download";link.href=currentVideoUrl;link.download="lex-"+id+".mp4";link.textContent="Download MP4";
          el("lexVideoActions").innerHTML="";el("lexVideoActions").appendChild(link);
          history.unshift({id:id,prompt:prompt,status:"completed",createdAt:Date.now()});history=history.slice(0,8);
          try{localStorage.setItem("flexo_lex_history",JSON.stringify(history))}catch(e){}
          renderHistory();button.disabled=false;return;
        }
      }catch(error){setStatus("Lex error: "+error.message);button.disabled=false;return}
      if(Date.now()-started>2700000){setStatus("This job is taking longer than expected. Check the backend job status.");button.disabled=false;return}
      setTimeout(tick,5000);
    }
    tick();
  }
}
if(d.readyState==="loading")d.addEventListener("DOMContentLoaded",boot);else boot();
})(window,document);
