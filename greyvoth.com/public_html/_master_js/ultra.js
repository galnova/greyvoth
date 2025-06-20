var uItems = angular.module('ultraItems', []);

var app = angular.module('app', ['ultraItems']);



uItems.controller('ultraItemController', function($scope) {

$scope.ultraItems = [

{

	count: 9978,

	month: 'September',

	year: '2020',

	desc: 'The world is ours!',

	story: 'GVM',

	house: 'none',

    character: 'kings',

	image: '../ultra/2020/Two-Kings-GVM.png',

	caption: 'Two Kings',

	gallery: 'gvm-gallery',

	color: 'color'

	},{

	count: 9988,

	month: 'August',

	year: '2020',

	desc: 'Galley VS. The Lovings 2 - Ticking',

	story: 'Ticking',

	house: 'none',

	character: 'Galley',

	image: '../ultra/2020/loving-grid.png',

	caption: 'Galley VS. The Lovings 2 - Ticking',

	gallery: 'ticking-gallery',

	color: 'color'

},

{

	count: 9970,

	month: 'August',

	year: '2020',

	desc: 'Loving Celeste - EPC',

	story: 'EPC',

	house: 'none',

	character: 'Celeste',

	image: '../ultra/2020/Loving-Celeste.png',

	caption: 'Loving Celeste - EPC',

	gallery: 'epc-gallery',

	color: 'color'

},

{

	count: 9988,

	month: 'August',

	year: '2020',

	desc: 'Galley VS. The Lovings - Ticking',

	story: 'Ticking',

	house: 'none',

	character: 'Galley',

	image: '../ultra/2020/lovings.png',

	caption: 'Galley VS. The Lovings - Ticking',

	gallery: 'ticking-gallery',

	color: 'color'

},

{

	count: 9985,

	month: 'August',

	year: '2020',

	desc: 'Loving Swoon Punches - Ticking',

	story: 'Ticking',

	house: 'none',

	character: 'Galley',

	image: '../ultra/2020/Loving-Swoon.png',

	caption: 'Loving Swoon Punches - Ticking',

	gallery: 'ticking-gallery',

	color: 'color'

},

{

	count: 9985,

	month: 'August',

	year: '2020',

	desc: 'Loving Swoon - EPC',

	story: 'EPC',

	house: 'none',

	character: 'Galley',

	image: '../ultra/2020/Loving-Swoon-2.png',

	caption: 'Loving Swoon - EPC',

	gallery: 'epc-gallery',

	color: 'color'

},	

{

	count: 9986,

	month: 'August',

	year: '2020',

	desc: 'Loving Copper - EPC',

	story: 'EPC',

	house: 'none',

	character: 'Galley',

	image: '../ultra/2020/Loving-Copper.png',

	caption: 'Loving Copper - EPC',

	gallery: 'epc-gallery',

	color: 'color'

},	

{

	count: 9987,

	month: 'August',

	year: '2020',

	desc: 'Loving Kenzie - EPC',

	story: 'EPC',

	house: 'none',

	character: 'Galley',

	image: '../ultra/2020/loving-kenzie.png',

	caption: 'Loving Kenzie - EPC',

	gallery: 'epc-gallery',

	color: 'color'

},

{

	count: 9989,

	month: 'August',

	year: '2020',

	desc: 'Sworn Holder Benny - EPC',

	story: 'EPC',

	house: 'none',

	character: 'Benny',

	image: '../ultra/2020/Benny-EPC.png',

	caption: 'Sworn Holder Benny - EPC',

	gallery: 'epc-gallery',

	color: 'color'

},

{

	count: 9990,

	month: 'August',

	year: '2020',

	desc: 'Loving Daphne - EPC',

	story: 'EPC',

	house: 'none',

	character: 'Just Daphne',

	image: '../ultra/2020/Loving-Daphne.png',

	caption: 'Loving Daphne - EPC',

	gallery: 'epc-gallery',

	color: 'color'

},

	{

	count: 9991,

	month: 'July',

	year: '2020',

	desc: 'Jessa - The Fire Mage - EPC',

	story: 'EPC',

	house: 'none',

	character: 'Fire Mage',

	image: '../ultra/2020/jessa-epc.png',

	caption: 'Jessa - The Fire Mage - EPC',

	gallery: 'epc-gallery',

	color: 'color'

},

{

	count: 9992,

	month: 'July',

	year: '2020',

	desc: 'Kendo the Ripper - The Boy with all the Secrets',

	story: 'GVM',

	house: 'none',

	character: 'ripper',

	image: '../ultra/2020/ripper.png',

	caption: 'Kendo the Ripper - The Boy with all the Secrets',

	gallery: 'gvm-gallery',

	color: 'color'

	},{

	count: 9993,

	month: 'July',

	year: '2020',

	desc: 'Grandle and Christopher - Partners',

	story: 'GVM',

	house: 'none',

	character: 'christopher',

	image: '../ultra/2020/grandle-christopher.png',

	caption: 'Christopher and Grandle - Partners',

	gallery: 'gvm-gallery',

	color: 'color'

	},{

	count: 9994,

	month: 'July',

	year: '2020',

	desc: 'Christopher and Grandle - Partners',

	story: 'GVM',

	house: 'none',

	character: 'grandle',

	image: '../ultra/2020/christopher-grandle.png',

	caption: 'Christopher and Grandle - Partners',

	gallery: 'gvm-gallery',

	color: 'color'

	},{

	count: 9995,

	month: 'July',

	year: '2020',

	desc: 'Shana and Flow - Fated Rivals',

	story: 'GVM',

	house: 'none',

    character: 'shana',

	image: '../ultra/2020/final_rivals.png',

	caption: 'Final Boss Fight',

	gallery: 'gvm-gallery',

	color: 'color'

	},{

	count: 9996,

	month: 'July',

	year: '2020',

	desc: 'Yosh and Samson\'s epic battle begins.',

	story: 'GVM',

	house: 'none',

    character: 'yosh',

	image: '../ultra/2020/rivals.png',

	caption: 'Bitter Rivals',

	gallery: 'gvm-gallery'

	},{

	count: 9997,

	month: 'July',

	year: '2020',

	desc: 'House Dark is a full power',

	story: 'GVM',

	house: 'none',

    character: 'chalstolce',

	image: '../ultra/2020/macabres.png',

	caption: 'House Dark',

	gallery: 'gvm-gallery',

	color: 'color'

	},{

	count: 9998,

	month: 'July',

	year: '2020',

	desc: 'Never stopping until the mission is done.',

	story: 'GVM',

	house: 'none',

    character: 'seth',

	image: '../ultra/2020/seth-rests.png',

	caption: 'Seth Gate - Chopper',

	gallery: 'gvm-gallery',

	color: 'color'

	},{

	count: 9999,

	month: 'July',

	year: '2020',

	desc: 'Grandle dodging one of Christopher\'s fireballs with ease.',

	story: 'GVM',

	house: 'Robe',

	character: 'grandle',

	image: '../ultra/2020/grandle-dodges.png',

	caption: 'Grandle - Gunner',

	gallery: 'gvm-gallery',

	color: 'color'

	},{

	count: 1,

	month: 'July',

	year: '2020',

	desc: 'Christopher charging up one of his fireballs.',

	story: 'GVM',

	house: 'none',

	character: 'christopher',

	image: '../ultra/2020/christopher-2.png',

	caption: 'Christopher - Saint',

	gallery: 'gvm-gallery',

	color: 'color'

	},{

	count: 2,

	month: 'July',

	year: '2019',

	desc: 'GVM - Backlash',

	story: 'GVM',

	image: '../ultra/2019/001.jpg',

	caption: 'GVM - Backlash',

	gallery: 'lotct-gallery',

	color: 'color'

	},{

	count: 3,

	month: 'July',

	year: '2019',

	desc: 'GVM - Taggers',

	story: 'GVM',

	image: '../ultra/2019/002.jpg',

	caption: 'GVM - Taggers',

	gallery: 'lotct-gallery',

	color: 'color'

	},{

	count: 4,

	year: '2019',

	desc: 'GVM - Rich and Company',

	story: 'GVM',

	image: '../ultra/2019/003.jpg',

	caption: 'GVM - Rich and Company',

	gallery: 'lotct-gallery',

	color: 'color'

	},{

	count: 5,

	month: 'July',

	year: '2019',

	desc: 'GVM - Rich\'s Defense',

	story: 'GVM',

	image: '../ultra/2019/006.jpg',

	caption: 'GVM - Rich\'s Defense',

	gallery: 'lotct-gallery',

	color: 'color'

	},{

	count: 6,

	month: 'July',

	year: '2019',

	desc: 'GVM - Deter - God of Destruction',

	story: 'GVM',

	image: '../ultra/2019/007.jpg',

	caption: 'GVM - Deter - God of Destruction',

	gallery: 'lotct-gallery',

	color: 'color'

	}

	];

});