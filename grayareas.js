
angular.module('exModule', []);
angular.module('exModule');
angular.module('exModule').controller('mainController', ['$scope', '$sce','$http', function($scope, $sce, $http){
$scope.storyshow = false;
$scope.color = "#000000"
$scope.actors = []
$scope.relations = [];
$scope.displayArray=[];
$scope.guardianDisplayArray=[];
$scope.relationshipValues = [
.2, .2, .1, .9, .9, .1, .2, .8, 1, .3, //Saudi
1, 1, .2, .8, .8, .3, .9, .2, .2, //Russia
1, .2, .1, 1, .8, .1, .7, 1,  //US
.1, .2, .1, .1, .1, .1, .2,  // Turkey
1, 1, .1, 1, .7, .1,  // Iran
.2, .1, .1, .1, .1,  // Al Nusra
.3, .1, .1, 1, // Syrian Kurds
.3, .3, .1,  //Iraqi Kurds
.1, .1,  //ISIL
1 //Syria
]
//function to allocate color
$scope.colorSelect = function(input){
	if (0 <= input <= .1){
		return '#6600FF'
	}
	else if (.1<input<=.2){
		return '#FF3300'
	}
	else if(.2<input<=.3){
		return '#FF9933'
	}
	else if(.3<input<=.4){
		return '#FFCC66'
	}
	else if(.4<input <=.5){
		return '#FFD6CC'
	}
	else if(.5< input<=.6){
		return'#D6F5D6'
	}	
	else if(.6 < input <=.7){
		return '#ADEBAD'
	}
	else if(.7< input <=.8){
		return'#FFFF99'
	}
	else if(.8< input <=.9){
		return '#CCFF66'
	}

	else if (.9< input <=1){
		return'#33CC33'
	}}

//Object for single actors
var SingleActor = function(header, UNqueryTerm, guardianQueryTerm){
	this.header=header;
	this.UNqueryTerm=UNqueryTerm;
	this.guardianQueryTerm=guardianQueryTerm
}
// Object for Relationship
var Relation = function (country1, country1UNQueryTerm, country1GuardianQueryTerm, country2, country2UNQueryTerm,  country2GuardianQueryTerm, score){
	this.country1=country1;
	this.country1UNQueryTerm = country1UNQueryTerm;
	this.country1GuardianQueryTerm=country1GuardianQueryTerm
	this.country2= country2;
	this.country2UNQueryTerm = country2UNQueryTerm;
	this.country2GuardianQueryTerm=country2GuardianQueryTerm
	this.score = score;
	this.color = '#CCCCCC';
	this.border= false;
}
// All Actors and Query Terms Below. 
// $scope.actors.push(new SingleActor('Iraqi Government','?query[value]=iraq%20iraqi[fields][]=title&query[operator]=OR'))
$scope.actors.push(new SingleActor('Iraqi Government','iraq','((iraq%20OR%20iraqi)%20AND%20government)'))
// $scope.actors.push(new SingleActor('Syrian Government','?query[value]=syria%20assad&query[fields][]=title&query[operator]=OR'))
$scope.actors.push(new SingleActor('Syrian Government','syria','(syria%20OR%20syrian%20OR%20assad)'))

$scope.actors.push(new SingleActor('ISIL','isis','(isis%20OR%20isil%20OR%20(islamic%20state))'))
$scope.actors.push(new SingleActor('Iraqi Kurdistan','iraq%20kurds','(kurdistan%20OR%20(iraq%20AND%20kurds))'))
$scope.actors.push(new SingleActor('Syrian Kurds / YPG','syrian%20kurds', '(ypg)'))
$scope.actors.push(new SingleActor('Al Nusra Front','nusra','(nusra)'))
$scope.actors.push(new SingleActor('Iran and Aligned Militias','iran','(iran%20OR%20irgc%20OR%20quds%20OR%20hezbollah)'))
$scope.actors.push(new SingleActor('Turkey','turkey', '(turkey)'))
$scope.actors.push(new SingleActor('United States','united%20states','(america)'))
$scope.actors.push(new SingleActor('Russia','russia','(russia)'))
$scope.actors.push(new SingleActor('Saudi Arabia / Arab Coalition','saudi','(saudi%20OR(arab%20coalition))'))

$scope.populate = function(){
	for(i=($scope.actors.length-1); i >0 ; i--){// populates relationship actors and query terms for Reliefweb API
		for (j = 0; j < i; j++){
				$scope.relations.push(new Relation($scope.actors[i].header, $scope.actors[i].UNqueryTerm, $scope.actors[i].guardianQueryTerm, $scope.actors[j].header, $scope.actors[j].UNqueryTerm, $scope.actors[j].guardianQueryTerm, 0))
		}
	}
	for(i = 0; i<$scope.relations.length; i++){ // Populates realtionship score and color values
		$scope.relations[i].score = $scope.relationshipValues[i];
		$scope.relations[i].color = $scope.colorSelect($scope.relations[i].score)
	}
	
}

$scope.populate() //populates Relationship Array.  
console.log($scope.relations)
console.log($scope.actors)
// Function that calls API for UN Reports
$scope.currentCountries = []
$scope.click = function(x){
	$scope.displayArray=[];
	$scope.guardianDisplayArray=[];
	$scope.storyshow = true;
		$scope.currentCountries = []
		$scope.currentCountries.push($scope.relations[x].country1)
		$scope.currentCountries.push($scope.relations[x].country2)
		$http.get('http://api.rwlabs.org/v1/reports?query[value]='+$scope.relations[x].country1UNQueryTerm+'%20'+$scope.relations[x].country2UNQueryTerm+'&query[fields][]=title&query[operator]=AND?query[value]=syria%20iraq%20war&query[fields][]=body&query[operator]=AND&sort[]=date:desc').then(function(response){
			for (var i=0; i<response.data.data.length; i++){
				$scope.displayArray.push(response.data.data[i])
			}	  	
		}, function(error){
		console.log(error)
		});

		$http.get('http://content.guardianapis.com/search?q=(('+$scope.relations[x].country2GuardianQueryTerm+'%20AND%20'+$scope.relations[x].country2GuardianQueryTerm+')%20AND%20((syria%20OR%20iraq)%20AND%20(war%20OR%20conflict)))&section=world&from-date=2014-01-01&api-key=e55xbt922tpbefw9tgyvbjtc').then(function(response){
			console.log($scope.relations[x].country1GuardianQueryTerm)

// +'%20OR%20'+$scope.relations[x].country2GuardianQueryTerm+')%20AND%20((syria%20OR%20iraq)%20AND%20(war%20OR%20conflict)))

			for (var i=0; i<response.data.response.results.length; i++){
				$scope.guardianDisplayArray.push(response.data.response.results[i])
			}	  	
		}, function(error){
		console.log(error)
		});
}

$scope.closeButton = function(){
	$scope.storyshow = false;
	$scope.bodyshow = false;
}

$scope.storyBack = function(){
	$scope.storyshow = true;
	$scope.bodyshow = false;
}
$scope.storyClose = function(){
	$scope.storyshow = false;
	$scope.bodyshow = false;
}

$scope.storystring ='';
$scope.bodyshow = false;
//necessary for Angular to Accept HTML 
$scope.to_trusted = function(html_code) {
    return $sce.trustAsHtml(html_code);
}
//function to pull HTML for UN Report from database
$scope.loadStory= function($index){
	$scope.storyshow = false;
	$scope.bodyshow = true;
	$http.get($scope.displayArray[$index].href).then(function(response){
		$scope.storystring = response.data.data[0].fields.body
	})
}

$scope.mouseOver = function(color){
	for (i=0; i<$scope.relations.length;i++){
		if(color != $scope.relations[i].color){
			$scope.relations[i].border=true;
		}
	}
}
$scope.mouseLeave = function(){
	for (i=0; i<$scope.relations.length;i++){
		$scope.relations[i].border=false;
	}
}
$scope.titleMouseOver=function(country){

for (i=0; i<$scope.relations.length;i++){
		$scope.relations[i].border = false;
		if((country != $scope.relations[i].country1)&&(country!=$scope.relations[i].country2)){
			$scope.relations[i].border=true;
		}
	}
}

}])




