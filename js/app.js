
const Employees = { name: 'Employees', template: '<h1>Тут будут Операторы</h1>' }
const Reglament = { name: 'Reglament', template: '<h1>Тут будет регламент обращений</h1>' }



const Conversations = Vue.extend({
	name: 'Conversations',
	data: function() {
		return {
			messages: []
		} 
	},
	methods: {
		deleteConv: function(accountId,cid,index){
			this.$http.post('/assignee/remove/account/'+accountId+'/cid/'+cid)
			// var element = this.messages.filter((ms)=>{return ms.conversationId == cid})[0]
			// var element_index = this.messages.indexOf(element)
			this.messages.splice(index, 1)	
		},
		getAssignee: function(){
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
			});
			setTimeout(this.getAssignee, 10000)
		}
	},
	created: function(){
		this.getAssignee()
	},
	computed: {
		filtermessages(){
			return this.messages.filter((ms)=>{
				return Object.values(ms).join('').toLowerCase().includes(this.$root.searchMessage.toLowerCase())	
			})
		}
	},
	template:
	'<div v-if="messages.length!=0">'+
	'<table class="table table-hover table-bordered table-responsive">'+
	'<thead ><tr class="active"><th>Cid</th><th>Аккаунт</th><th>Статус</th><th>Собеседник</th><th>Оператор</th><th></th></tr></thead>' +
	'<tbody v-for="(ms,index) in filtermessages">' +
	'<tr v-bind:class="ms.status" v-bind:id ="ms.conversationId"  >' +
	'<td>{{ms.conversationId}}</td><td>{{ms.accountId}}</td><td>{{ms.state}}</td><td>{{ms.discourserId}}</td><td>{{ms.employeeId}}</td>' +
	'<td><button v-on:click="deleteConv(ms.accountId,ms.conversationId,index)" type="button" class="btn btn-danger btn-sm" >Закрыть</button></td>' +
	'</tr>' +
	'</tbody>'+
	'</table>'+
	'</div>'+
	'<div v-else>'+
	'<div class="alert alert-danger"><strong>Ошибка!</strong> Сервер втирает какую то дичь, пробую получить данные</div>'+
	'<div class="progress"><div class="progress-bar progress-bar-striped active"  style="width:100%"></div></div>'+
	'</div>'

})

const Overview = Vue.extend({
	name: 'Overview',
	data: function(){
		return {
			countAccounts: 0,
			countAssignee: 0
		}
	},
	methods: {
		getAssigneeCounts: function(){
			this.$http.get('/assignee/response.json')
			.then(response => {
				this.countAssignee = response.body.length
			})
			setTimeout(this.getAssigneeCounts, 10000)
		},
		getAccountsCounts: function(){
			this.$http.get('/account/response.json')
			.then(response => {
				this.countAccounts = response.body.length
			})
			setTimeout(this.getAccountsCounts, 10000)
		}
	},

	created: function(){
		this.getAssigneeCounts();
		this.getAccountsCounts()

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
	{ path: '/', component: Overview },
	{ path: '/view', component: Overview },
	{ path: '/conv', component: Conversations },
	{ path: '/emp', component: Employees },
	{ path: '/reglament', component: Reglament }
	],
	mode: 'history',
})


new Vue({
	name: 'Core-UI',
	el:'#app1',
	data:{
		searchMessage: ''
	},
	
	router: router
})