//this is  global 
Questions = new Meteor.Collection('Questions');

var getCurrentEmail = function(){
    return Meteor.user() && Meteor.user().emails && Meteor.user().emails[0].address;
}; 

if (Meteor.isClient) {
    Template.questions.allQuestions = function() {
	var i = 0;
	return _.map(Questions.find({}, {
	    sort: {score: -1}
	}).fetch(), function(value) {
	    return _.extend(value, {idx: i++});
	});
    };

    Template.questions.userId = function () {
	return Meteor.userId();
    }; 

    Template.questions.showArrow = function (){
	return  Meteor.userId() && 
	    ! _.contains(this.votes, Meteor.userId());
    };
    
    Template.questions.events({
	"click #questionAsk": function (evnt, templte) {
	    var question = templte.find("#questionText").value;
	    Questions.insert({question: question, 
			      score: 1, 
			      email: getCurrentEmail(),
			      votes: [Meteor.userId()]
			      
			     });
	},
	"click .vote": function (evvent, templ){
	    Questions.update(this._id, {
		$inc: {score: 1},
		$addToSet: {votes: Meteor.userId()}  
	    });
	}
    });
}



if (Meteor.isServer){                                                           
    Questions.allow({
        insert: function(userId, doc) {
            if(!  _.isEqual(doc.votes, [userId])){
		return false;
            }
            if(!doc.email || !doc.question) {
		return false
            }
            if(doc.score !== 1) {
		return false;
            }
            return true;
	},
        update: function(userId, doc, fieldNames, modifier){
            return _.isEqual(modifier, {
                $inc: {score: 1},
                $addToSet: {votes: Meteor.userId()}
            });
        }

    }); 
}

 






