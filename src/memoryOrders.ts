export const ingredients = [
  { id: 'espresso', name: 'Espresso', action: 'Brew espresso', color: '#80503c', meaning: 'Korean café hopping, adventures & Sarah’s black-coffee backup' },
  { id: 'matcha', name: 'Matcha', action: 'Whisk matcha', color: '#8fa875', meaning: 'Sarah’s first choice. Always ahead of coffee.' },
  { id: 'tea', name: 'Tea', action: 'Steep tea', color: '#b3b58a', meaning: 'A slow pause & a little rejuvenation' },
  { id: 'milk', name: 'Milk', action: 'Pour milk', color: '#f5ead4', meaning: 'Home comforts, Olive & nights in' },
  { id: 'oat', name: 'Oat milk', action: 'Pour oat milk', color: '#dec49c', meaning: 'Building together: LEGO, designs & everyday teamwork' },
  { id: 'vanilla', name: 'Vanilla', action: 'Add vanilla', color: '#e8c17b', meaning: 'Creative dates, artsy details & Sarah’s beautiful plans' },
  { id: 'honey', name: 'Honey', action: 'Drizzle honey', color: '#d99c44', meaning: 'Animal encounters & golden travel memories' },
  { id: 'cocoa', name: 'Cocoa', action: 'Add cocoa', color: '#92614d', meaning: 'Aamir’s dessert appetite & reality-TV drama' },
  { id: 'cinnamon', name: 'Cinnamon', action: 'Sprinkle cinnamon', color: '#bd7b53', meaning: 'Baddie energy, thrills & affectionate chaos' },
  { id: 'ice', name: 'Ice', action: 'Add ice', color: '#c4dedc', meaning: 'A chilled finish for a travel memory' },
] as const;

export type IngredientId = typeof ingredients[number]['id'];
export type HostName = 'Aamir' | 'Olive';
export type MemoryOrder = {
  id: string;
  chapter: number;
  customer: HostName;
  drink: string;
  dialogue: string;
  memory: string;
  recipe: IngredientId[];
  success: string;
};

export const chapters = [
  { title: 'Sarah, Aamir & the Midnight Manager', subtitle: 'One artsy baddie. One missing wallet. One very hungry cat.', reward: 'A Sarah & Aamir keepsake', decoration: 'photo' },
  { title: 'Built by Us', subtitle: 'LEGO before celebrations. Reality TV after. Matcha throughout.', reward: 'A sage-green flower arrangement', decoration: 'flowers' },
  { title: 'Our World, One Detour at a Time', subtitle: 'UAE, South Korea, Sri Lanka. And animals absolutely everywhere.', reward: 'Our travel-memory lights', decoration: 'lights' },
  { title: 'Thrills, Hoppers & Little Escapes', subtitle: 'Quad bikes, turtles, fresh vegetables, and a seafood stop.', reward: 'Sarah’s birthday garland', decoration: 'garland' },
  { title: 'Next Stop: 29 & Fabulous', subtitle: 'Saudi on the wish list. You, always on mine.', reward: 'Sarah’s birthday cake', decoration: 'cake' },
] as const;

// These recipes are playful game interpretations, not claims about drinks ordered on the trips.
// Update dialogue, memory and recipe together. Bump SAVE_KEY when replacing order IDs or recipes.
export const memoryOrders: MemoryOrder[] = [
  {
    id: 'olive-midnight-menu', chapter: 0, customer: 'Olive', drink: 'Olive’s 3 A.M. Room Service',
    dialogue: 'Meow, Sarah. Who wakes you and Aamir in the middle of the night for food? Me. Your tiny manager. Brew espresso for you humans, add home-comfort milk and a pinch of cinnamon chaos. I will supervise; my cat food is separate.',
    memory: 'Olive wakes both of you in the middle of the night for food. Apparently the kitchen has a 24-hour service agreement neither human remembers signing.',
    recipe: ['espresso', 'milk', 'cinnamon'],
    success: 'Correct. I have eaten; you humans may now consider going back to sleep. Pending my approval.',
  },
  {
    id: 'aamir-wallet', chapter: 0, customer: 'Aamir', drink: 'The Wallet Is at Home',
    dialogue: 'One warm espresso, please. Add cocoa for my dessert appetite and cinnamon for the chaos of forgetting my wallet. Again. No milk. Sarah, can you get this one?',
    memory: 'Aamir forgets his wallet every time. The dessert appetite, however, always makes it out of the house.',
    recipe: ['espresso', 'cocoa', 'cinnamon'],
    success: 'Drink: secured. Dessert: located. Wallet: experiencing another work-from-home day.',
  },
  {
    id: 'matcha-first', chapter: 0, customer: 'Aamir', drink: 'Sarah’s Actual First Choice',
    dialogue: 'What does Sarah choose before black coffee, every time? Whisk that green favourite and serve it just as it is. One ingredient. No milk, no syrup, no coffee subplot.',
    memory: 'Sarah loves matcha. It is always her first preference; black coffee is mainly the backup when matcha is not available. This simple game recipe celebrates that priority, not a specific real-life matcha preparation.',
    recipe: ['matcha'],
    success: 'Matcha first. Everything else can take a number. The café understands its priorities.',
  },
  {
    id: 'black-coffee-backup', chapter: 0, customer: 'Aamir', drink: 'In Case of No Matcha',
    dialogue: 'Imagine the matcha has run out. What is Sarah’s backup? A warm black coffee: espresso alone. No milk, sweeteners or ice. This is the emergency plan, not the favourite.',
    memory: 'Sarah majorly drinks black coffee when there is no matcha. Matcha has not been dethroned; it is merely temporarily unavailable.',
    recipe: ['espresso'],
    success: 'Backup accepted. Please restock matcha before this becomes a personality crisis.',
  },
  {
    id: 'olive-aliases', chapter: 0, customer: 'Olive', drink: 'One Cat, Many Identities',
    dialogue: 'Pandu? Mohammed Khurshid? Chotu Gullu? Sarah, how many names have you given me? Make yourself matcha, add milk for home with me and cinnamon for nickname chaos. Warm, please. I am only the supervisor.',
    memory: 'Your cat is Olive. Sarah also calls Olive Pandu, Mohammed Khurshid, Chotu Gullu, and many more names. One food bowl, an impressive number of aliases.',
    recipe: ['matcha', 'milk', 'cinnamon'],
    success: 'All my aliases approve this human-only drink. I would still prefer actual cat food. You may address me as management.',
  },
  {
    id: 'artsy-sarah', chapter: 1, customer: 'Aamir', drink: 'The Artsy Baddie',
    dialogue: 'For the very artsy person behind this café: Sarah’s favourite green base, vanilla for her creative details, and cinnamon for baddie energy. Just those three, warm.',
    memory: 'Sarah is very artsy. Sarah is also a baddie. These are complementary design principles, not mutually exclusive features.',
    recipe: ['matcha', 'vanilla', 'cinnamon'],
    success: 'Art direction: immaculate. Baddie credentials: never in question.',
  },
  {
    id: 'lego-before-events', chapter: 1, customer: 'Aamir', drink: 'Before We Celebrate, We Build',
    dialogue: 'What do we always build before birthdays and anniversaries? A LEGO ritual deserves matcha, oat milk for building together and vanilla for our celebration plans. Keep it warm.',
    memory: 'Sarah and Aamir both love making LEGO builds. You always do it before events such as birthdays and your anniversary. A celebration needs a little construction first.',
    recipe: ['matcha', 'oat', 'vanilla'],
    success: 'Birthday plan: build LEGO together, then celebrate. Some traditions are worth keeping brick by brick.',
  },
  {
    id: 'designer-engineer', chapter: 1, customer: 'Aamir', drink: 'Designed by Sarah, Debugged by Aamir',
    dialogue: 'You design the interiors, I write the software. Who makes the space beautiful, and who debugs the buttons? Brew espresso, add oat milk for our teamwork and vanilla for your beautiful design. No other dependencies.',
    memory: 'Sarah is an interior designer. Aamir is a software engineer. One makes the space beautiful; the other is very likely wondering why the button moved.',
    recipe: ['espresso', 'oat', 'vanilla'],
    success: 'Sarah approved the interiors. Aamir approved the implementation. Nobody approved Olive’s opening hours.',
  },
  {
    id: 'sage-and-blues', chapter: 1, customer: 'Aamir', drink: 'Sage Meets Every Shade of Blue',
    dialogue: 'Whose favourite colour is sage green, and who collects shades of blue? Whisk Sarah’s green favourite, add oat milk for your partnership and vanilla for the shared palette. Serve warm.',
    memory: 'Sarah’s favourite colour is sage green. Aamir likes different shades of blue. The café’s little sage-and-blue touches belong to both of you.',
    recipe: ['matcha', 'oat', 'vanilla'],
    success: 'Sage for Sarah, blues for Aamir. An extremely well-designed partnership.',
  },
  {
    id: 'sims-gamer', chapter: 1, customer: 'Olive', drink: 'Professional Sim Architect',
    dialogue: 'You call yourself a gamer, Sarah. Is the arena The Sims 4 again? Whisk matcha for yourself, add oat milk for building another world and cinnamon for that gamer confidence. No ice. I will judge from beside the screen.',
    memory: 'Sarah calls herself a gamer and plays The Sims 4. An interior designer spending her gaming time designing another life? The brand consistency is excellent.',
    recipe: ['matcha', 'oat', 'cinnamon'],
    success: 'Gamer status: accepted. That Sim house is lovely. Does it have a room for me? Ideally with several food bowls.',
  },
  {
    id: 'reality-tv', chapter: 1, customer: 'Aamir', drink: 'Just One More Reality Episode',
    dialogue: 'What do we love watching together? Start with matcha, add milk for a night in and cocoa for reality-TV drama. Warm. We need to discuss these contestants’ decisions.',
    memory: 'Sarah and Aamir like watching reality TV shows together. The show provides the drama; the sofa provides the commentary department.',
    recipe: ['matcha', 'milk', 'cocoa'],
    success: 'We would obviously make better decisions than the contestants. From the sofa. With snacks.',
  },
  {
    id: 'planner-within-plans', chapter: 2, customer: 'Aamir', drink: 'An Itinerary Inside an Itinerary',
    dialogue: 'Who makes the best trip plans, and then plans trips inside those trips? Matcha for Sarah, vanilla for the itinerary, cinnamon for the bonus itinerary, and ice for the journey. No milk.',
    memory: 'You both love travelling, and Sarah makes the best trip plans. She also makes trip plans within trips. The itinerary has an itinerary.',
    recipe: ['matcha', 'vanilla', 'cinnamon', 'ice'],
    success: 'Main plan: excellent. Nested plan: excellent. Unscheduled fun: scheduled for 4:15.',
  },
  {
    id: 'abu-dhabi-parks', chapter: 2, customer: 'Aamir', drink: 'Abu Dhabi, Full Speed',
    dialogue: 'Ferrari World and SeaWorld belong to which UAE stop? For Abu Dhabi, brew espresso, add cinnamon for the thrills, honey for the animals and ice for a chilled travel finish.',
    memory: 'In the UAE, you visited Ferrari World and SeaWorld in Abu Dhabi. Thrills and animals: a very Sarah-and-Aamir combination.',
    recipe: ['espresso', 'cinnamon', 'honey', 'ice'],
    success: 'Ferrari World, SeaWorld, and still somehow enough energy for the next stop on Sarah’s plan.',
  },
  {
    id: 'dubai-burj', chapter: 2, customer: 'Aamir', drink: 'Dubai: More Than One Tall Building',
    dialogue: 'You explored almost everywhere in Dubai. Which famous tower was not your favourite? Brew espresso with vanilla for the packed sightseeing plan and ice. No sweetener beyond the vanilla.',
    memory: 'You visited almost every place in Dubai, but did not like the Burj Khalifa that much. A famous landmark does not automatically beat your favourite little moments.',
    recipe: ['espresso', 'vanilla', 'ice'],
    success: 'Burj Khalifa: tall. Your enthusiasm: not quite as tall. Honest travel reviews only.',
  },
  {
    id: 'south-korea-coffees', chapter: 2, customer: 'Aamir', drink: 'Our Favourite Destination, Another Coffee',
    dialogue: 'Which destination is our favourite, with so many coffees along the way? For South Korea, brew espresso and add only ice. A black iced coffee, with absolutely no milk or syrup.',
    memory: 'South Korea is your favourite destination together, and you had a lot of coffees there. This black iced coffee is a game tribute, not a claim about a specific order.',
    recipe: ['espresso', 'ice'],
    success: 'South Korea: our favourite. Number of coffees: let us call it thorough cultural research.',
  },
  {
    id: 'alpaca-world', chapter: 2, customer: 'Olive', drink: 'Alpacas on the Itinerary',
    dialogue: 'Sarah, which stop on your Korea plan involved alpacas? I heard about Alpaca World. Whisk matcha for yourself, drizzle honey for the animals and add ice for the travel finish. Three ingredients. I am counting.',
    memory: 'You visited Alpaca World in South Korea. If an animal experience exists, there is a good chance it makes it onto one of your trips.',
    recipe: ['matcha', 'honey', 'ice'],
    success: 'Alpacas in the scrapbook. Me in management. Different departments, equally important work.',
  },
  {
    id: 'capybara-birds', chapter: 2, customer: 'Olive', drink: 'Capybara & Company',
    dialogue: 'Capybara AND birds in South Korea? Your animal report is getting extensive, Sarah. Brew tea for the humans, add honey for those encounters and ice. I would like to inspect the bird photos.',
    memory: 'In South Korea you saw capybara and other birds, alongside your Alpaca World visit. Animal cameos are practically a recurring travel feature.',
    recipe: ['tea', 'honey', 'ice'],
    success: 'Capybara energy: unbothered. Bird photos: very interesting. I remain the most important fluffy creature in this family.',
  },
  {
    id: 'korean-food', chapter: 2, customer: 'Aamir', drink: 'BBQ, Chaeum, Then Fried Chicken',
    dialogue: 'Which Korea favourites made the food shortlist? Korean BBQ, Chaeum traditional Korean food and fried chicken. Espresso for Korea, vanilla for the food plan, cocoa for my inevitable dessert detour. Warm, no milk.',
    memory: 'Your favourite foods in South Korea included Korean BBQ, Chaeum traditional Korean food and fried chicken. The cocoa is a nod to Aamir’s love of dessert, not an ingredient in those meals.',
    recipe: ['espresso', 'vanilla', 'cocoa'],
    success: 'Three excellent food memories. And Aamir would still like to see the dessert menu.',
  },
  {
    id: 'sri-lanka-elephants', chapter: 3, customer: 'Olive', drink: 'Sri Lanka’s Gentle Giants',
    dialogue: 'Which Sri Lankan adventure involved elephants, Sarah? For that safari memory, steep tea for yourself, add honey for the animals and vanilla for your lovely plan. Warm, just those three. Even I admit those are impressive animals.',
    memory: 'You went on an elephant safari in Sri Lanka. Another trip, another beautiful animal memory together.',
    recipe: ['tea', 'honey', 'vanilla'],
    success: 'Elephant safari: approved. Your travels have an excellent animal cast. I am still the lead at home.',
  },
  {
    id: 'swimming-with-turtles', chapter: 3, customer: 'Aamir', drink: 'Turtles, Not Just Tourists',
    dialogue: 'In Sri Lanka, who did you swim with? For the turtles, whisk matcha, add honey for the wildlife and ice for the water-side travel memory. Nothing else.',
    memory: 'Sarah and Aamir swam with turtles in Sri Lanka. Seeing animals on a trip is lovely; sharing the water with turtles is its own kind of magic.',
    recipe: ['matcha', 'honey', 'ice'],
    success: 'Turtles in the water, both of you in the memory. A very good day to be on Sarah’s itinerary.',
  },
  {
    id: 'sri-lanka-hoppers', chapter: 3, customer: 'Aamir', drink: 'Sarah Would Like More Hoppers',
    dialogue: 'Which Sri Lankan food did Sarah really like? Hoppers. Make a warm matcha with vanilla for that delicious food stop and milk for comfort. This is the tribute drink, not a hopper recipe!',
    memory: 'Sarah liked hoppers a lot in Sri Lanka. Some travel memories are views; some deserve another plate.',
    recipe: ['matcha', 'vanilla', 'milk'],
    success: 'Hoppers: Sarah-approved. Another serving would be entirely reasonable.',
  },
  {
    id: 'della-quad-bike', chapter: 3, customer: 'Aamir', drink: 'Quad-Bike Baddie',
    dialogue: 'At Della Adventure in Lonavala, who was exceptionally good on the quad bike? Whisk matcha for Sarah, add cinnamon for the thrills and honey for a golden adventure memory. Warm, no milk.',
    memory: 'You did lots of thrilling activities at Della Adventure in Lonavala. Sarah was exceptionally good at quad biking. Baddie status comes with off-road credentials.',
    recipe: ['matcha', 'cinnamon', 'honey'],
    success: 'Sarah on a quad bike: exceptionally good. Aamir’s official review: that is my wife.',
  },
  {
    id: 'fazlani-reset', chapter: 3, customer: 'Aamir', drink: 'Freshly Picked, Fully Recharged',
    dialogue: 'Where did you pluck vegetables and rejuvenate with good food? For Fazlani Nature’s Nest, steep tea for the reset, add oat milk for doing it together and honey for the golden memory. Warm.',
    memory: 'At Fazlani Nature’s Nest, you plucked vegetables and rejuvenated with good food. A little slower, a little greener, and very well fed.',
    recipe: ['tea', 'oat', 'honey'],
    success: 'Vegetables: plucked. Good food: appreciated. Both humans: rejuvenated.',
  },
  {
    id: 'goa-seafood', chapter: 3, customer: 'Olive', drink: 'Goa, With a Seafood Stop',
    dialogue: 'I heard there was seafood in the Goa chapter, Sarah. Tell me everything. Make your matcha with vanilla for the food-date plan and ice for the coastal travel finish. No milk. This cup is for you; I am here for the gossip.',
    memory: 'You have been to Goa together and both like seafood. This drink is a little coastal tribute; thankfully, the ingredient shelf contains no actual seafood.',
    recipe: ['matcha', 'vanilla', 'ice'],
    success: 'Goa memory served. No seafood in the matcha. Even my management style has boundaries.',
  },
  {
    id: 'shopping-side-quest', chapter: 4, customer: 'Olive', drink: 'Just Browsing, Allegedly',
    dialogue: 'Your recurring side quest is shopping, Sarah. Whisk your matcha, add vanilla for lovely things and cinnamon for “just one more shop.” Warm. If anything arrives in a box, please forward the box to management.',
    memory: 'Sarah likes shopping a lot and does it most of the time. An artsy interior designer noticing beautiful things everywhere? Very on-brand.',
    recipe: ['matcha', 'vanilla', 'cinnamon'],
    success: 'You get the shopping. I request the boxes. This is what a successful household partnership looks like.',
  },
  {
    id: 'fun-date-planners', chapter: 4, customer: 'Aamir', drink: 'Our Next Fun Date',
    dialogue: 'We love planning fun dates. Let us build a warm cup with matcha, oat milk for doing things together and vanilla for the plan. Then cocoa, because I would like dessert. Obviously.',
    memory: 'Sarah and Aamir like planning fun dates together. Aamir also likes eating a lot of dessert. A good date plan can comfortably acknowledge both facts.',
    recipe: ['matcha', 'oat', 'vanilla', 'cocoa'],
    success: 'Time with you, something fun to do, and dessert. That is a very strong date proposal.',
  },
  {
    id: 'saudi-next', chapter: 4, customer: 'Aamir', drink: 'Saudi Is on the List',
    dialogue: 'Which destination are you planning next, not remembering as a past trip? Saudi! Whisk matcha, add vanilla for Sarah’s upcoming plan and honey for the animal encounters that seem to find you everywhere. Warm.',
    memory: 'You are planning to go to Saudi. It is a future trip, not one you have already taken. You tend to encounter lots of animals on your trips; the honey is a hopeful tribute, not a claim about a Saudi visit.',
    recipe: ['matcha', 'vanilla', 'honey'],
    success: 'Saudi: still ahead of us. Sarah’s planning brain: probably already several trips inside the trip.',
  },
  {
    id: 'anniversary-lego', chapter: 4, customer: 'Aamir', drink: 'One More Brick Before the Candles',
    dialogue: 'Before the birthday candles or anniversary celebrations, what do you two love doing? Matcha for Sarah, oat milk for LEGO teamwork, vanilla for the occasion and cinnamon for birthday magic. Keep it warm.',
    memory: 'Making LEGO builds together before birthdays and anniversaries is your tradition. There is enough room in this café for both a little construction and a lot of celebration.',
    recipe: ['matcha', 'oat', 'vanilla', 'cinnamon'],
    success: 'LEGO first, candles next. Another year of building a lovely little life together.',
  },
  {
    id: 'sarah-aamir-olive', chapter: 4, customer: 'Aamir', drink: 'My Favourite Little World',
    dialogue: 'One last cup for my artsy, sage-green-loving, quad-biking, Sims-playing baddie. Matcha for you, milk for home with Olive, oat milk for our LEGO builds, vanilla for your plans and cocoa for my dessert. Warm. Stir with love.',
    memory: 'Sarah, Aamir and Olive: your little world. UAE, South Korea, Sri Lanka, Goa, Lonavala, Fazlani, and Saudi still to come. The best part is getting to do life together.',
    recipe: ['matcha', 'milk', 'oat', 'vanilla', 'cocoa'],
    success: 'For Sarah, from Aamir. Wallet possibly missing. Love absolutely present. Happy 29th birthday, my favourite person.',
  },
];

export function ingredientName(id: IngredientId): string {
  return ingredients.find((ingredient) => ingredient.id === id)!.name;
}

export function isIngredient(value: unknown): value is IngredientId {
  return ingredients.some((ingredient) => ingredient.id === value);
}

export function hasDrinkBase(cup: IngredientId[]): boolean {
  return cup.includes('espresso') || cup.includes('matcha') || cup.includes('tea');
}
