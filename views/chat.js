var ChatApp=window.React.createClass({
	getInitialState:function(){
		return {
			login:'0',
			thread:0,
			threads:[],
			messages:[]
	}
	},setUser:function(){
		var user=document.getElementById("user").value;
		this.setState({user:user});
	}	
	,sendMessage: function(message) {
    var that = this;
	
	if($("#message2").val()==""){	
    $.ajax({
      url: '../post',
      method: 'post',
      dataType: 'json',
      data: {uname:that.state.login, tname:that.state.thread, text: document.getElementById("message").value },
      success: function(data) {
   //   alert(JSON.stringify(data));
      }.bind(this)
    });
	}else{
		 $.ajax({
      url: '../post/'+$("#message2").val(),
    /*  method: 'post',
      dataType: 'json',
	  headers: {"X-HTTP-Method-Override": "PUT"},*/
//	  type: "PUT",
  method: 'PUT',
  //  contentType: "application/json",
  dataType: 'json',
   error: function (request, status, error) {
       // alert(request.responseText+"@"+status+"@"+error);
    },
      data: { text: $("#message").val() },
      success: function(data) {
     //   alert(JSON.stringify(data));
		
      }.bind(this)
    });
		
	}
	 $("#message").val("");
  //$("#message2").value=id.substring(3);
  document.getElementById("message2").value="";
	
	
	
	
  },setThread:function(t){
	  this.setState({thread:t});
	  this.getMessages();
	  this.render();
  },editPost:function(id){
	 // alert();
  //$($("#"+id).children()[2]).prop("disabled",false);
  
  $("#message").val($($("#"+id).children()[1]).html());
  //$("#message2").value=id.substring(3);
  document.getElementById("message2").value=id.substring(3);
  
  },editThread:function(id,e){
	// alert(id);
  //$($("#"+id).children()[2]).prop("disabled",false);
 e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
 
 
  $("#message").val($($("#"+id).children()[0]).html());
  //$("#message2").value=id.substring(3);
  document.getElementById("message2").value=id.substring(2);
  
  },deletePost: function(id) {
	 // alert(id);
	   $.ajax({
      url: '../post/'+id,
      method: 'delete',
      dataType: 'json',
      //data: {uname:that.state.user, tname:that.state.thread, text: document.getElementById("message").value },
      success: function(data) {
     // alert(JSON.stringify(data));
      }.bind(this)
    });
  },deleteThread: function(id) {
	 // alert(id);
	   $.ajax({
      url: '../thread/'+id,
      method: 'delete',
      dataType: 'json',
      //data: {uname:that.state.user, tname:that.state.thread, text: document.getElementById("message").value },
      success: function(data) {
   //   alert(JSON.stringify(data));
      }.bind(this)
    });
  },createThread: function(message) {
    var that = this;
	
	if($("#message2").val()==""){	
    $.ajax({
      url: '../thread',
      method: 'post',
      dataType: 'json',
      data: {name:$("#message").val() },
      success: function(data) {
     // alert(JSON.stringify(data));
      }.bind(this)
    });
	}else{
		 $.ajax({
      url: '../thread/'+$("#message2").val(),
    /*  method: 'post',
      dataType: 'json',
	  headers: {"X-HTTP-Method-Override": "PUT"},*/
//	  type: "PUT",
  method: 'PUT',
  //  contentType: "application/json",
  dataType: 'json',
      data: { name: $("#message").val() },
      success: function(data) {
      //  alert(JSON.stringify(data));
		
      }.bind(this)
    });
		
	}
	 $("#message").val("");
  //$("#message2").value=id.substring(3);
  document.getElementById("message2").value="";
	
	
	
	
  },login:function(){
	  var login=$("#login").val();
	  var pass =$("#pass").val();
	     $.ajax({
      url: '../login',
      method: 'post',
      dataType: 'json',
      data: {name:login,pass:pass },
	 /* error: function(data) {alert("Chybné jméno nebo heslo");},*/
      success: function(data) {
  //alert(JSON.stringify(data));
 //alert(data.user.name);
 if(data.success==true){
	 this.setState({login:data.user.name});
	   this.getMessages();
	  this.render();
	  }else{
		  alert("Chybné jméno nebo heslo");
	  }
      }.bind(this)
    });
  },logout:function(){
	      $.ajax({
      url: '../logout',
      method: 'post',
      dataType: 'json',
     // data: {name:login,pass:pass },
      success: function(data) {
 //    alert(JSON.stringify(data));
 //alert(data.user.name);
	    this.setState({login:"0"});
	//   this.getMessages();
	//  this.render();
      }.bind(this)
    });
  },createUser:function(){
	  var login=$("#login").val();
	  var pass =$("#pass").val();
	     $.ajax({
      url: '../users',
      method: 'post',
      dataType: 'json',
      data: {name:login,pass:pass },
      success: function(data) {
 //    alert(JSON.stringify(data));
 //alert(data.user.name);
	    this.setState({login:data.user.name});
	   this.getMessages();
	  this.render();
      }.bind(this)
    });
  }
  
  ,render:function(){
		var self=this;
		var messages=self.state.messages.map(function(msg){
			return( <li className="postli" id={"msg"+msg.id}><strong>{msg.uname}:</strong><span >{msg.text}</span>
			<button  onClick={(e)=>self.editPost("msg"+msg.id,e)}>Edit</button>
			<button onClick={(e)=>self.deletePost(msg.id,e)}>Delete</button>
			</li>);
		});
		var threads=self.state.threads.map(function(msg){
			return( <li onClick={()=>self.setThread(msg.name)} className='vlaknoli' id={"th"+msg.name}><strong >{msg.name}</strong>
			<button  onClick={(e)=>self.editThread("th"+msg.name,e)}>Edit</button>
			<button onClick={(e)=>self.deleteThread(msg.name,e)}>Delete</button>
			</li>);
		});
		if(self.state.login=="0"){
		return (	<div id="log">
			<p><span>Login:</span><input id="login" type="text"/></p><p><span>Password:</span><input  id="pass" type="password" /></p>
		<button onClick={()=>self.login()}>Login</button><button onClick={()=>self.createUser()}>Create User</button>
			</div>);
		}else if(self.state.thread==0){
			return (
		<div><span>username:{self.state.login}<button onClick={()=>self.logout()}>Logout</button></span><ul>
		{threads}
		</ul>
		<input id="message" type="text"/><input  id="message2" type="text" />
		<button onClick={()=>self.createThread()}>SEND</button>
		<br/>
	
		</div>)		;
		}else{
		return (
		<div><span>username:{self.state.login}<button onClick={()=>self.logout()}>Logout</button></span><button onClick={()=>self.setThread(0)}>Back</button><ul>
		{messages}
		</ul>
		<input id="message" type="text"/><input  id="message2" type="text" />
		<button onClick={()=>self.sendMessage()}>SEND</button>
		<br/>
	
		</div>)		;
		}
		
	} , componentDidMount: function() {
    // get the list of messages
    this.getMessages();
    // set the poll interval
    setInterval(this.getMessages, 3000);
  } , getMessages: function() {
	  if(this.state.thread==0){
		   $.ajax({
      url: '../thread',
      dataType: 'json',
      success: function(data) {
		//  alert(JSON.stringify(data));
		if(data.login==0){
			this.setState({user:"0"});
		}else{
			this.setState({threads: data.threads,login:data.login});
		}
      }.bind(this)
    });
	  }else{
		 $.ajax({
      url: '../thread/'+this.state.thread,
      dataType: 'json',
      success: function(data) {
		//  alert(JSON.stringify(data.posts));
		if(data.login==0){
			this.setState({user:"0"});
		}else{
			 this.setState({messages: data.posts,login:data.login});
		}
       
      }.bind(this)
    }); 
	  }
   
  }
  
});
window.ReactDOM.render(<ChatApp/>,document.getElementById("chat"));