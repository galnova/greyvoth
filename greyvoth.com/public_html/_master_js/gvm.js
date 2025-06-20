var gvmItems = angular.module('gvmItems', []);

var app = angular.module('app', ['gvmItems', 'gvm2Items']);



gvmItems.controller('gvmItemController', function($scope) {

$scope.gvmItems = [

	{id: 0,

	title: 'The Human God - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Sol-GVM.png',

	thumb: '../A20/profile/Sol-GVM-3.png',

	name: 'Sol Weber',

	nickname: 'The AllKing',

	house: 'All Houses',

	age: '??',

	job: 'God on Earth',

	style: 'Lights',

	type: 'God',

	anid: 'allkingInfo',

	nameshort: 'Sol',

	story: 'King of Earth (Blessed with the powers of God by the Gods). Sol is sometimes cruel and sometimes fair. He always does exactly what the Gods command him to do.',

	datasrc: '#allkingInfo',

	weaponname: 'Hand of God',

	weapon: '../ultra/2020/crin-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 10,

	title: 'Robe King - GVM',

	data: 'gvm-main',

	link: '../ultra/2020/Robe-King-GVM.png',

	thumb: '../ultra/2020/Robe-King-GVM-3.png',

	name: 'Crin Robinson',

	nickname: 'The Robe King',

	house: 'Robe',

	age: '36',

	job: 'Robe Lord',

	style: 'Hope Bringer',

	type: 'Noble',

	anid: 'robekingInfo',

	nameshort: 'Crin',

	story: 'King of Lords (The most powerful nation as the story begins). Crin has Final Boss level strength and a strong sense of justice.',

	datasrc: '#robekingInfo',

	weaponname: 'Star Dusk',

	weapon: '../ultra/2020/crin-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 1,

	title: 'Taur - GVM',

	data: 'gvm-main',

	link: '../ultra/2020/Taur-GVM.png',

	thumb: '../ultra/2020/Taur-GVM-3.png',

	name: 'Taur Weber',

	nickname: 'The Wizard Queen',

	house: 'Weber',

	age: '30',

	job: 'Mage Lord',

	style: 'Sager',

	type: 'Vile',

	anid: 'taurInfo',

	nameshort: 'Taur',

	story: 'Queen of Lore (The land of Magic). Taur has Final Boss level magic and she seeks to create the ultimate magic spell',

	datasrc: '#taurInfo',

	weaponname: 'Venga',

	weapon: '../ultra/2020/taur-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 1,

	title: 'Chalstolce - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Chalstolce-GVM.png',

	thumb: '../A20/profile/GVM-chalstolce.png',

	name: 'Chalstolce Macabre',

	nickname: 'The Dark Master',

	house: 'Dark',

	age: '36',

	job: 'Dark Lord',

	style: 'Fate Slayer',

	type: 'Righteous',

	anid: 'chalstolceInfo',

	nameshort: 'Chalstolce',

	story: 'King of Ottom (The second most powerful nation as the story begins). Chalstolce has Final Boss level strength and a thirst for mastering the most arcane spells.',

	datasrc: '#chalstolceInfo',

	weaponname: 'God Bleeder',

	weapon: '../A20/profile/chalstolce-weapon.png',

	data2: 'gvm-main2'

	},{

	id: 1,

	title: 'Lem - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Lem-WolfKing.png',

	thumb: '../A20/profile/Lem-WolfKing-3.png',

	name: 'Lem',

	nickname: 'Dog',

	house: 'Wolf',

	age: '16',

	job: 'Wolf Lord',

	style: 'Eclipse Fang',

	type: 'Sycophant',

	anid: 'lemInfo',

	nameshort: 'Lem',

	story: 'King of Lunas (The source of lunar energy for the Earth). Lem is loyal to the AllKing after his race was spared from Genocide.',

	datasrc: '#lemInfo',

	weaponname: 'Basilisk',

	weapon: '../A20/profile/lems-weapon-GVM.png',

	data2: 'gvm-main2'

	}, {

	id: 2,

	title: 'Yosh - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Yosh-GVM.png',

	thumb: '../A20/profile/GVM-yosh.png',

	name: 'Yosh Baskerville',

	nickname: 'The Soldier',

	house: 'Robe',

	age: '18',

	job: 'Robe Knight',

	style: 'Slicer',

	type: 'Cautious',

	anid: 'yoshInfo',

	nameshort: 'Yosh',

	story: 'A knight who is tasked with giving Grandle daily training. When the Robe House is attacked, Yosh is ordered by the King to get Grandle to safety. He hates Samson.',

	datasrc: '#yoshInfo',

	weaponname: 'Rhetoric',

	weapon: '../A20/profile/yosh-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 3,

	title: 'Samson - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Samson-GVM.png',

	thumb: '../A20/profile/GVM-samson.png',

	name: 'Samson',

	nickname: 'The Street Fighter',

	house: 'None',

	age: '17',

	job: 'Fighter',

	style: 'Dicer',

	type: 'Bold',

	anid: 'samsonInfo',

	nameshort: 'Samson',

	story: 'A self-trained Prize Fighter who takes on all comers. He has a quick wit and always tries to fight Yosh because of his hatred of the houses.',

	datasrc: '#samsonInfo',

	weaponname: 'Y-Calibre',

	weapon: '../A20/profile/samson-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 4,

	title: 'Grandle - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Grandle-GVM.png',

	thumb: '../A20/profile/GVM-grandle.png',

	name: 'Grandle Robinson',

	nickname: 'The Prince',

	house: 'Robe',

	age: '14',

	job: 'Robe Prince',

	style: 'Gunner',

	type: 'Cocky',

	anid: 'grandleInfo',

	nameshort: 'Grandle',

	story: 'The Robe prince future Robe King. He is a wise cracking prankster who is forced to flee Guiresphere when the Robe House is attacked. He uses guns to defend him self while he trains to be a fighter.',

	datasrc: '#grandleInfo',

	weaponname: 'Twin Talons',

	weapon: '../A20/profile/grandle-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 5,

	title: 'Shana - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Shana-GVM.png',

	thumb: '../A20/profile/GVM-shana.png',

	name: 'Shana Robinson',

	nickname: 'The Princess',

	house: 'Robe',

	age: '18',

	job: 'Robe General',

	style: 'Slicer',

	type: 'Confident',

	anid: 'shanaInfo',

	nameshort: 'Shana',

	story: 'The Robe princess and Grandle\'s big sister. She is very skilled with a blade and head strong. When the House of Robe is attacked, she goes on a mission to rally the entire might of the Robe House for a counterattack',

	datasrc: '#shanaInfo',

	weaponname: 'Robin',

	weapon: '../A20/profile/shana-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 6,

	title: 'Christopher - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Christopher-GVM.png',

	thumb: '../A20/profile/GVM-christopher.png',

	name: 'Christopher',

	nickname: 'The Saint',

	house: 'None',

	age: '20',

	job: 'Fighter',

	style: 'Brawler',

	type: 'Quiet',

	anid: 'christopherInfo',

	nameshort: 'Christopher',

	story: 'A Prize Fighter who is resting up before the World Championship Finals. Though strong, he is saving up his energy for the big fight and let\'s Samson do all fighting for now.',

	datasrc: '#christopherInfo',

	weaponname: 'Just Gloves',

	weapon: '../A20/profile/christopher-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 7,

	title: 'Seth - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Seth-Gate-GVM.png',

	thumb: '../A20/profile/GVM-seth.png',

	name: 'Seth Gate',

	nickname: 'The Wandering Soldier',

	house: 'Lit',

	age: '20',

	job: 'Lit Knight',

	style: 'Chopper',

	type: 'Proud',

	anid: 'sethInfo',

	nameshort: 'Seth',

	story: 'A Lit Knight who went AWOL to avenge his family. Now his goal is to become an Olin (Traveling Fighter) to win lots of money for the Lit Army.',

	datasrc: '#sethInfo',

	weaponname: 'Splitter',

	weapon: '../A20/profile/seth-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 8,

	title: 'Flow - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Flow-GVM.png',

	thumb: '../A20/profile/GVM-flo.png',

	name: 'Flow Macabre',

	nickname: 'The Fiercest Fighter',

	house: 'Dark',

	age: '18',

	job: 'Dark General',

	style: 'Chopper',

	type: 'Focused',

	anid: 'flowInfo',

	nameshort: 'Flow',

	story: 'Sent by the Dark King to retrieve his sacred stolen sword. She travels to Guiresphere following up on a lead of it\'s last know location.',

	datasrc: '#flowInfo',

	weaponname: 'Stormers',

	weapon: '../A20/profile/flow-weapon.png',

	data2: 'gvm-main2'

	}, {

	id: 9,

	title: 'Kendo the Ripper - GVM',

	data: 'gvm-main',

	link: '../A20/profile/Kendo-Rip-GVM.png',

	thumb: '../A20/profile/GVM-kendo.png',

	name: 'Kendo the Ripper',

	nickname: 'Dark Stranger',

	house: 'None',

	age: '??',

	job: 'The Chained',

	style: 'Mace Demon',

	type: 'Erradic',

	anid: 'kendoInfo',

	nameshort: 'Ripper',

	story: 'An abandoned prisoner from Lords. He has a high death count and many secrets. The party keeps him around because has information they need to complete their mission.',

	datasrc: '#kendoInfo',

	weaponname: 'Ball and Chain',

	weapon: '../A20/profile/kendo-weapon.png',

	data2: 'gvm-main2'

}];



$scope.gvm2Items = [{

id: 1,

name: 'The Wolf King - Lem',

year: '2020',

type: 'ink',

img: '../A20/ink-20/1.PNG',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 2,

name: 'The AllKing - Sol Weber',

year: '2020',

type: 'ink',

img: '../A20/ink-20/2.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 3,

name: 'Lit Knight',

year: '2020',

type: 'ink',

img: '../A20/ink-20/3.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 4,

name: 'Lunar Soldier',

year: '2020',

type: 'ink',

img: '../A20/ink-20/4.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 5,

name: 'Macabre Knight',

year: '2020',

type: 'ink',

img: '../A20/ink-20/5.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 6,

name: 'Crin Robinson',

year: '2020',

type: 'ink',

img: '../A20/ink-20/6.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 7,

name: 'First Betrayal',

year: '2020',

type: 'ink',

img: '../A20/ink-20/7.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 8,

name: 'Lion Fists',

year: '2020',

type: 'ink',

img: '../A20/ink-20/8.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 9,

name: 'The Decision',

year: '2020',

type: 'ink',

img: '../A20/ink-20/9.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 10,

name: 'The Webers',

year: '2020',

type: 'ink',

img: '../A20/ink-20/10.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 11,

name: 'Chalstolce',

year: '2020',

type: 'ink',

img: '../A20/ink-20/11.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 12,

name: 'The Plan',

year: '2020',

type: 'ink',

img: '../A20/ink-20/12.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 13,

name: 'The Witnesses',

year: '2020',

type: 'ink',

img: '../A20/ink-20/13.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 14,

name: 'A Jealous King',

year: '2020',

type: 'ink',

img: '../A20/ink-20/14.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 15,

name: 'Countered',

year: '2020',

type: 'ink',

img: '../A20/ink-20/15.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 16,

name: 'A Red Spell',

year: '2020',

type: 'ink',

img: '../A20/ink-20/16.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 17,

name: 'Crin kills the AllKing',

year: '2020',

type: 'ink',

img: '../A20/ink-20/17.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 18,

name: 'No Trust',

year: '2020',

type: 'ink',

img: '../A20/ink-20/18.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 19,

name: 'Power Siphon',

year: '2020',

type: 'ink',

img: '../A20/ink-20/19.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 20,

name: 'Henri',

year: '2020',

type: 'ink',

img: '../A20/ink-20/20.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 21,

name: 'God Crin?',

year: '2020',

type: 'ink',

img: '../A20/ink-20/21.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 22,

name: 'Grandle loses',

year: '2020',

type: 'ink',

img: '../A20/ink-20/22.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 23,

name: 'The Robinsons',

year: '2020',

type: 'ink',

img: '../A20/ink-20/23.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 24,

name: 'In the face of God',

year: '2020',

type: 'ink',

img: '../A20/ink-20/24.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 25,

name: 'The Eln',

year: '2020',

type: 'ink',

img: '../A20/ink-20/25.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 26,

name: 'The God Chalstolce',

year: '2020',

type: 'ink',

img: '../A20/ink-20/26.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 27,

name: 'The God Taur',

year: '2020',

type: 'ink',

img: '../A20/ink-20/27.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 28,

name: 'The God Crin',

year: '2020',

type: 'ink',

img: '../A20/ink-20/28.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 29,

name: 'The God Chalstolce-Full',

year: '2020',

type: 'ink',

img: '../A20/ink-20/29.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 31,

name: 'The God Taur-Full',

year: '2020',

type: 'ink',

img: '../A20/ink-20/31.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 30,

name: 'The God Crin-Full',

year: '2020',

type: 'ink',

img: '../A20/ink-20/30.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 32,

name: 'The Gods',

year: '2020',

type: 'ink',

img: '../A20/ink-20/32.jpg',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

},{

id: 33,

name: 'Ignis Weber',

year: '2020',

type: 'ink',

img: '../A20/ink-20/33.png',

program: 'Procreate',

desc: 'Galaxy Inks @galnova'

}

];	

});