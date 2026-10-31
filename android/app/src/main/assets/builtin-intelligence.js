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
if(any(q,["import chats from chatgpt","import chatgpt conversations","import conversations","how do i import","how to import","how can i import","bring my old chats","upload a conversation export","import claude","import gemini","import deepseek"]))return out("guide","To import an existing conversation export:\n1. Open Settings.\n2. Under Import existing conversations, tap the service or export type you want to import.\n3. Read the on-screen export instructions, then tap Choose file.\n4. Select the downloaded ZIP, JSON, TXT, MD, CSV, or HTML file. ZIP exports are searched for conversation JSON files.\n5. Wait for the Imported confirmation. Your imported conversations are added to the Knowledge Library and can be searched in chat.\n\nFlexo cannot sign in to another service or download its export for you.");
if(any(q,["how do i export","how to export","how can i export","export my flexo","export my data","export chats","export chat history","backup my data","download my data","save my data as a file","make a backup"]))return out("guide","To export your Flexo data:\n1. Open Settings.\n2. Find General.\n3. Tap Export data.\n4. On Android, choose where to save the file in the system save dialog and confirm. In a web browser, the JSON file downloads through the browser.\n\nThe file is named flexo-data.json and contains your current chats, Knowledge Library entries, and settings. Keep a copy somewhere safe. Exporting does not delete anything from Flexo.");
if(any(q,["where is my export","where did my export go","where is the exported file","where is my backup","where are downloads saved"]))return out("guide","When you export from the Android app, Flexo opens the system Save dialog. The file is saved in the folder you choose; check that location in your Files app. In a web browser, check the browser’s Downloads list or Downloads folder.");
if(any(q,["restore my backup","restore flexo data","import flexo backup","how do i restore","how to restore"]))return out("guide","Flexo can export a full flexo-data.json backup, but this version does not yet have a one-tap restore for that full backup. You can re-import supported conversation exports through Settings → Import existing conversations. Keep your original backup file safe; do not delete it.");
if(any(q,["how do i add knowledge","how to add knowledge","upload knowledge","add a file","add files","upload a file","add notes","write notes","add to knowledge library"]))return out("guide","To add information to your Knowledge Library:\n1. Open the Knowledge tab.\n2. Tap Add files and choose one or more TXT, MD, CSV, or JSON files.\n3. Or tap Write manually to paste notes and save them.\n4. Return to chat and ask a question about the information you added.\n\nFlexo searches the text you import; it does not scan other folders on its own.");
if(any(q,["what file types","which file formats","supported file formats","what files can i upload","file types supported"]))return out("guide","For your Knowledge Library, Add files supports TXT, MD, CSV, and JSON. For conversation imports in Settings, the picker also accepts ZIP, HTML, and those text formats. ZIP imports look inside for conversation JSON files.");
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
