
const Employees = { template: '<h1>Тут будут Операторы</h1>' }
const Reglament = { template: '<h1>Тут будет регламент обращений</h1>' }


const Conversations = Vue.extend({
	data: function() {
		return {
			messages: [] ,
			searchMessage: this.$root.searchMessage
		} 
	},
	methods: {
		deleteConv: function(accountId,cid){
			this.$http.post('/assignee/remove/account/'+accountId+'/cid/'+cid)
			var element = this.messages.filter((ms)=>{return ms.conversationId == cid})[0]
			var element_index = this.messages.indexOf(element)
			this.messages.splice(element_index, 1)	
			console.log(element,element_index)
		}
	},
	created: function(){
		this.$http.get('/assignee/response.json')
		.then(response => {
			response.body.map((assignee)=>{
				if (assignee.state == "Assigne") assignee.status = "success"
					else if (assignee.state == "ExpectAssigne") assignee.status = "info"
						else if (assignee.state == "ExpectConversation") assignee.status = "warning"
							else assignee.status = "danger"	
						}
					)
			this.messages = response.body
		},error => {
			alert(error.status)
		});
	},
	computed: {
		filtermessages(){
			return this.messages.filter((ms)=>{
				return Object.values(ms).join('').toLowerCase().includes(this.$root.searchMessage)	
			})
		}

	},
	template: 
	'<table class="table table-hover table-bordered table-responsive">'+
	'<thead ><tr class="active" ><th>Cid</th><th>Аккаунт</th><th>Статус</th><th>Собеседник</th><th>Оператор</th><th></th></tr></thead>' +
	'<tbody v-for="ms in filtermessages">' +
	'<tr v-bind:class="ms.status" v-bind:id ="ms.conversationId"  >' +
	'<td>{{ms.conversationId}}</td><td>{{ms.accountId}}</td><td>{{ms.state}}</td><td>{{ms.discourserId}}</td><td>{{ms.employeeId}}</td>' +
	'<td><button v-on:click="deleteConv(ms.accountId,ms.conversationId)" type="button" class="btn btn-danger btn-sm" >Закрыть</button></td>' +
	'</tr>' +
	'</tbody>'+
	'</table>'
})

const Statistic = Vue.extend({

	data: function(){
		return {
			countAccounts: 0,
			countAssignee: 0
		}
	},

	beforeCreate: function(){
		this.$http.get('/assignee/response.json')
		.then(response => {
			this.countAssignee = response.body.length
		})
		this.$http.get('/account/response.json')
		.then(response => {
			this.countAccounts = response.body.length
		})
	},

	template:
	'<div class="panel panel-default">'+
	'<div class="panel-heading">Статистика Core-App</div>'+
	'<div class="panel-body">'+
	'<div class="alert alert-info">Активных аккаунтов <strong>{{countAccounts}}</strong></div>'+
	'<div class="alert alert-info">Активных обращений <strong>{{countAssignee}}</strong></div>'+
	'</div>'+
	'</div>'
})


const router = new VueRouter({
	routes:  [
	{ path: '/', component: Statistic },
	{ path: '/conv', component: Conversations },
	{ path: '/emp', component: Employees },
	{ path: '/reglament', component: Reglament }
	],
	mode: 'history',
})


new Vue({
	el:'#app1',
	data:{
		searchMessage: ''
	},
	
	router: router
})