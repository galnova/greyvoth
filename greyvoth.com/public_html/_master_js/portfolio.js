var portItems = angular.module('portItems', []);
var app = angular.module('app', ['portItems', 'port1Items', 'port2Items', 'gvm1Items', 'ink18Items', 'ink19Items', 'ink20Items']);

portItems.controller('portItemController', function($scope) {
$scope.portItems = [{
id: 10,
name: 'Dina Mur',
year: '2018',
type: 'character',
img: '../2018/sorte-1/2018-2.jpg',
program: 'Procreate',
desc: 'Dina Mur - Digital Drawing'
}, {
id: 8,
name: 'Cyborg',
year: '2018',
type: 'character',
img: '../2018/sorte-1/2018-3.jpg',
program: 'Sketchbook Pro',
desc: 'Cyborg - Digital Drawing'
}, {
id: 8,
name: 'Brotherhood',
year: '2018',
type: 'character',
img: '../2018/sorte-1/2018-4.jpg',
program: 'Procreate',
desc: 'Brotherhood - Digital Drawing'
}, {
id: 08,
name: 'Rich Eitzchaarg',
year: '2018',
type: 'character',
img: '../2018/sorte-1/2018-6.jpg',
link: '',
program: 'Procreate',
desc: 'Rich Eitzchaarg - Digital Drawing'
}, {
id: 999,
name: 'Sideshow',
year: '2018',
type: 'character',
img: '../2018/sorte-1/2018-9.jpg',
program: 'Procreate',
desc: 'Sideshow - Digital Drawing'
}, {
id: 10,
name: 'Fortra',
year: '2018',
type: 'character',
img: '../2018/sorte-1/2018-14.jpg',
program: 'Procreate',
desc: 'Fortra - Digital Drawing'
}];

$scope.port1Items = [
{
id: 7,
name: 'Homepage 1',
year: '2019',
type: 'UI',
img: '../2019/UI/all_home_1.png',
program: 'VS Code',
desc: 'Homepage 1 - UI Design'
}, {
id: 8,
name: 'Homepage 2',
year: '2019',
type: 'UI',
img: '../2019/UI/all_home_2.png',
program: 'VS Code',
desc: 'Homepage 2 - UI Design'
}, {
id: 9,
name: 'Homepage 3',
year: '2019',
type: 'UI',
img: '../2019/UI/all_home_3.png',
program: 'VS Code',
desc: 'Homepage 3 - UI Design'
},{
id: 10,
name: 'ID Card 1',
year: '2019',
type: 'UI',
img: '../2019/UI/id_1.png',
program: 'VS Code',
desc: 'ID Card - UI Design'
},{
id: 11,
name: 'ID Card 2',
year: '2019',
type: 'UI',
img: '../2019/UI/id_2.png',
program: 'VS Code',
desc: 'ID Card Mobile - UI Design'
},{
id: 11,
name: '1 Col - Open',
year: '2019',
type: 'UI',
img: '../2019/UI/1_open_1.png',
program: 'VS Code',
desc: '1 Col Open - UI Design'
},{
id: 12,
name: '2 Col - Open',
year: '2019',
type: 'UI',
img: '../2019/UI/2_open_1.png',
program: 'VS Code',
desc: '2 Col Open - UI Design'
},{
id: 13,
name: '3 Col - Open',
year: '2019',
type: 'UI',
img: '../2019/UI/3_open_1.png',
program: 'VS Code',
desc: '3 Ccol Open - UI Design'
},{
id: 14,
name: '3 Col - Special',
year: '2019',
type: 'UI',
img: '../2019/UI/3_open_1.png',
program: 'VS Code',
desc: '3 Ccol Open Mobile- UI Design'
},{
id: 15,
name: 'Rewards',
year: '2019',
type: 'UI',
img: '../2019/UI/rewards_1.png',
program: 'VS Code',
desc: 'Rewards - UI Design'
},{
id: 16,
name: 'Rewards - Mobile',
year: '2019',
type: 'UI',
img: '../2019/UI/rewards_2.png',
program: 'VS Code',
desc: 'Rewards - Mobile UI Design'
},{
id: 17,
name: 'Big Tabs',
year: '2019',
type: 'UI',
img: '../2019/UI/big_tabs_1.png',
program: 'VS Code',
desc: 'Big Tabs - Mobile UI Design'
},{
id: 18,
name: 'Big Tabs - Mobile',
year: '2019',
type: 'UI',
img: '../2019/UI/big_tabs_2.png',
program: 'VS Code',
desc: 'Big Tabs - Mobile UI Design'
},{
id: 19,
name: 'Messages',
year: '2019',
type: 'UI',
img: '../2019/UI/messages_1.png',
program: 'VS Code',
desc: 'Messages - UI Design'
},{
id: 20,
name: 'Messages - Mobile',
year: '2019',
type: 'UI',
img: '../2019/UI/messages_2.png',
program: 'VS Code',
desc: 'Messages - Mobile UI Design'
},
{
id: 21,
name: 'Extra - Tiles',
year: '2019',
type: 'UI',
img: '../2019/UI/extra_tiles_1.png',
program: 'VS Code',
desc: 'Tiles - UI Design'
},{
id: 22,
name: 'Extra - Tiles 2',
year: '2019',
type: 'UI',
img: '../2019/UI/extra_tiles_2.png',
program: 'VS Code',
desc: 'Tiles - Mobile UI Design'
},{
id: 23,
name: 'Extra - Tabs',
year: '2019',
type: 'UI',
img: '../2019/UI/extra_tabs_1.png',
program: 'VS Code',
desc: 'Tabs - UI Design'
},{
id: 24,
name: 'Extra - Tabs 2',
year: '2019',
type: 'UI',
img: '../2019/UI/extra_tabs_2.png',
program: 'VS Code',
desc: 'Tabs - Mobile UI Design'
},{
id: 25,
name: 'Extra - Header',
year: '2019',
type: 'UI',
img: '../2019/UI/extra_header_1.png',
program: 'VS Code',
desc: 'Extra Header - UI Design'
}];
	
$scope.port2Items = [{
id: 3,
name: 'Knowledge Pass',
year: '2011',
type: 'gdesign',
img: '../A11/pass.jpg',
program: 'adobe illustrator',
desc: 'Poster design for graduate school'
}, {
id: 4,
name: 'Rand Poster 1',
year: '2013',
type: 'gdesign',
img: '../nu_images/gd_42.jpg',
program: 'adobe illustrator',
desc: 'Poster design for graduate school'
}, {
id: 5,
name: 'Rand Poster 2',
year: '2013',
type: 'gdesign',
img: '../nu_images/gd_43.jpg',
program: 'adobe illustrator',
desc: 'Poster design for graduate school'
}, {
id: 6,
name: 'Rand Poster 3',
year: '2013',
type: 'gdesign',
img: '../nu_images/gd_44.jpg',
program: 'adobe illustrator',
desc: 'Poster design for graduate school'
}, {
id: 77,
name: 'Rand Poster 4',
year: '2013',
type: 'gdesign',
img: '../nu_images/gd_45.jpg',
program: 'Adobe illustrator',
desc: 'Poster design for graduate school'
}];

$scope.gvm1Items = [{
id: 1,
name: 'Sword Killers',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/000.jpg',
program: 'Procreate',
desc: 'Blademen, Hasho and Quose'
}, {
id: 2,
name: 'Enter Backlash',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/001.jpg',
program: 'Procreate',
desc: 'Backlash and crew'
}, {
id: 3,
name: 'Taggers',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/002.jpg',
program: 'Procreate',
desc: 'Fierce Warriors'
}, {
id: 4,
name: 'Rich Eitzchaarg',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/003.jpg',
program: 'Procreate',
desc: 'Orientation Day'
}, {
id: 5,
name: 'Defense',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/006.jpg',
program: 'Procreate',
desc: 'Never Back Down'
}, {
id: 6,
name: 'Deter - God',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/007.jpg',
program: 'Procreate',
desc: 'There is fear'
}, {
id: 7,
name: 'Kain Baskerville',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/014.jpg',
program: 'Procreate',
desc: 'The Last Sword'
}, {
id: 8,
name: 'Black Ninjak',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/017.jpg',
program: 'Procreate',
desc: 'Evil Intent'
}, {
id: 9,
name: 'Cedric',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/018.jpg',
program: 'Procreate',
desc: 'The Demonseed'
}, {
id: 10,
name: 'The Jump',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/021.jpg',
program: 'Procreate',
desc: 'Fear the leap'
}, {
id: 11,
name: 'Last Ditch',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/022.jpg',
program: 'Procreate',
desc: 'V. Tarry'
}, {
id: 12,
name: 'Wheelman',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/024.jpg',
program: 'Procreate',
desc: 'Quose'
}, {
id: 13,
name: 'Bernard',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/023.jpg',
program: 'Procreate',
desc: 'V. Tarry'
}, {
id: 14,
name: 'The Finals',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/025.jpg',
program: 'Procreate',
desc: 'Shine V. Bernard'
}, {
id: 15,
name: 'Lem',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/026.jpg',
program: 'Procreate',
desc: 'The Houselord'
},{
id: 16,
name: 'The Final Blow',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/027.jpg',
program: 'Procreate',
desc: 'Kiss of Death'
},{
id: 17,
name: 'Christ',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/028.jpg',
program: 'Procreate',
desc: 'The Return'
},{
id: 18,
name: 'Wolf Rich',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/029.jpg',
program: 'Procreate',
desc: 'Transformation'
},{
id: 19,
name: 'Arc Cops',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/026.jpg',
program: 'Procreate',
desc: 'Hasho and company'
},{
id: 20,
name: 'Brove',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/031.jpg',
program: 'Procreate',
desc: 'The Warrior Pose'
},{
id: 21,
name: 'LOTCT Poster',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/032.jpg',
program: 'Procreate',
desc: 'The Gang'
},{
id: 22,
name: 'Tay and Ain',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/033.jpg',
program: 'Procreate',
desc: 'Young Love'
},{
id: 23,
name: 'Single Strike',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/034.jpg',
program: 'Procreate',
desc: 'Kain Unleashed'
},{
id: 24,
name: 'Besties',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/035.jpg',
program: 'Procreate',
desc: 'The Freaks'
},{
id: 25,
name: 'The RIP Clan',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/036.jpg',
program: 'Procreate',
desc: 'Kendo Rip'
},{
id: 26,
name: 'Mouse',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/037.jpg',
program: 'Procreate',
desc: 'Ex Arc Cop'
},{
id: 27,
name: 'Cold Lovers',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/038.jpg',
program: 'Procreate',
desc: 'Sam & Kain'
},{
id: 28,
name: 'The Lion',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/039.jpg',
program: 'Procreate',
desc: 'Zach'
},{
id: 29,
name: 'Amariah',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/040.jpg',
program: 'Procreate',
desc: 'Pyramid House'
},{
id: 30,
name: 'Hasho Weber',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/041.png',
program: 'Procreate',
desc: 'Winter Fight'
},{
id: 31,
name: 'Two Princes',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/042.png',
program: 'Procreate',
desc: 'Homer & Grandle'
},{
id: 32,
name: 'Sword Grasp',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/043.png',
program: 'Procreate',
desc: 'Master Blademen'
},{
id: 33,
name: 'Deter Close',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/044.png',
program: 'Procreate',
desc: 'Son of Dover'
},{
id: 34,
name: 'Quose V. Tin',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/045.jpg',
program: 'Procreate',
desc: 'Ulitmate Cpunter'
},{
id: 35,
name: 'LOTCT Poster 2',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/046.jpg',
program: 'Procreate',
desc: 'Fight Forever'
},{
id: 36,
name: 'Triptic 1',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/Triptic-1.png',
program: 'Procreate',
desc: 'Shine & others'
},{
id: 37,
name: 'Triptic 2',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/Triptic-2.png',
program: 'Procreate',
desc: 'Hasho & others'
},{
id: 38,
name: 'Triptic 3',
year: '2019',
type: 'gvm',
img: '../2019/gvm-19/Triptic-3.png',
program: 'Procreate',
desc: 'Shine & others'
}];
	
$scope.ink18Items = [{
id: 1,
name: 'Poison Boxer',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-1-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
name: 'Music',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-2-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 3,
name: 'Magic Shield',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-3-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 4,
name: 'Wizard Down',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-4-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 5,
name: 'We are Venom',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-5-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 6,
name: 'Last Round',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-6-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 7,
name: 'Hidden',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-7-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 8,
name: 'The Great One',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-8-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 9,
name: 'The War',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-9-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 10,
name: 'Leap of Faith',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-10-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 11,
name: 'Dangerous Cargo',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-11-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 12,
name: 'Summoners',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-12-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 13,
name: 'Surrounded',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-13-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 14,
name: 'Magic Tree',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-14-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 15,
name: 'Sleep',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-15-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 16,
name: 'Mario',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-16-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 17,
name: 'Best Friends',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-17-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 18,
name: 'Clutch',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-18-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 19,
name: 'Daxton',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-19-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 20,
name: 'Defense',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-20-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 21,
name: 'Gods',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-21-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 22,
name: 'Treasury',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-22-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 23,
name: 'Agony',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-23-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 24,
name: 'Thunder Sword',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-24-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 25,
name: 'Explorer',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-25-2018.png',

program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 26,
name: 'Mail',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-26-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 27,
name: 'Vice',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-27-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 28,
name: 'Betrayed',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-28-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 29,
name: 'Best Enemies',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-29-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 30,
name: 'Zach',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-30-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 31,
name: 'Slice',
year: '2018',
type: 'ink',
img: '../2019/ink-2018/day-31-2018.png',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}];
	
$scope.ink19Items = [{
id: 1,
name: 'Sayer Rock',
year: '2019',
type: 'ink',
img: '../A19/ink-19/1.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
name: 'Flame Punch',
year: '2019',
type: 'ink',
img: '../A19/ink-19/2.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 3,
name: 'The Ripper',
year: '2019',
type: 'ink',
img: '../A19/ink-19/3.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 4,
name: 'Icy',
year: '2019',
type: 'ink',
img: '../A19/ink-19/4.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 5,
name: 'Little',
year: '2019',
type: 'ink',
img: '../A19/ink-19/5.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 6,
name: 'Last Kick',
year: '2019',
type: 'ink',
img: '../A19/ink-19/6.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 7,
name: 'Nona',
year: '2019',
type: 'ink',
img: '../A19/ink-19/7.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 8,
name: 'Armbar',
year: '2019',
type: 'ink',
img: '../A19/ink-19/8.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 9,
name: 'The Punch',
year: '2018',
type: 'ink',
img: '../A19/ink-19/9.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 10,
name: 'The Bowl',
year: '2019',
type: 'ink',
img: '../A19/ink-19/10.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 11,
name: 'Dragoneer',
year: '2019',
type: 'ink',
img: '../A19/ink-19/11.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 12,
name: 'Floating City',
year: '2019',
type: 'ink',
img: '../A19/ink-19/12.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 13,
name: 'Magic Shield',
year: '2019',
type: 'ink',
img: '../A19/ink-19/13.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 14,
name: 'Time Team',
year: '2019',
type: 'ink',
img: '../A19/ink-19/14.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 15,
name: 'Swing',
year: '2019',
type: 'ink',
img: '../A19/ink-19/15.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 16,
name: 'Herman',
year: '2019',
type: 'ink',
img: '../A19/ink-19/16.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 17,
name: 'Rivals',
year: '2019',
type: 'ink',
img: '../A19/ink-19/17.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 18,
name: 'High Tower',
year: '2019',
type: 'ink',
img: '../A19/ink-19/18.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 19,
name: 'Roundhouse',
year: '2019',
type: 'ink',
img: '../A19/ink-19/19.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 20,
name: 'Riches',
year: '2019',
type: 'ink',
img: '../A19/ink-19/20.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 21,
name: 'New Gods',
year: '2019',
type: 'ink',
img: '../A19/ink-19/21.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 22,
name: 'Old Gods',
year: '2019',
type: 'ink',
img: '../A19/ink-19/22.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 23,
name: 'The End',
year: '2019',
type: 'ink',
img: '../A19/ink-19/23.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 24,
name: 'Faction',
year: '2019',
type: 'ink',
img: '../A19/ink-19/24.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 25,
name: 'Cute',
year: '2019',
type: 'ink',
img: '../A19/ink-19/25.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 26,
name: 'Tay Gida',
year: '2019',
type: 'ink',
img: '../A19/ink-19/26.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 27,
name: 'Chosen World',
year: '2019',
type: 'ink',
img: '../A19/ink-19/27.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 28,
name: 'Love',
year: '2019',
type: 'ink',
img: '../A19/ink-19/28.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 29,
name: 'Goddess',
year: '2019',
type: 'ink',
img: '../A19/ink-19/29.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 30,
name: 'Cure',
year: '2019',
type: 'ink',
img: '../A19/ink-19/30.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}, {
id: 31,
name: 'Frenemies',
year: '2019',
type: 'ink',
img: '../A19/ink-19/31.PNG',
program: 'Procreate',
desc: 'Galaxy Inks @galnova'
}];
	
$scope.ink20Items = [{
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