
const Employees = { name: 'Employees', template: '<h1>Тут будут Операторы</h1>' }
const Reglament = { name: 'Reglament', template: '<h1>Тут будет регламент обращений</h1>' }

const timeToUpdate = 10000

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
			this.messages.splice(index, 1)	
		},
		getAssignee: function(){
			this.$http.get('/assignee/response.json')
			.then(response => {
				this.messages = response.body
			});
			setTimeout(this.getAssignee, timeToUpdate)
		},
		setStyle: function(state){
			switch (state) {
				case 'Assigne': return 'success'
				break
				case 'ExpectAssigne': return 'info'
				break
				case 'ExpectConversation': return 'warning'
				break
				default: return 'danger'
			}
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
	'<tr v-bind:class="setStyle(ms.state)" v-bind:id ="ms.conversationId"  >' +
	'<td>{{ms.conversationId}}</td><td>{{ms.accountId}}</td><td>{{ms.state}}</td><td>{{ms.discourserId}}</td><td>{{ms.employeeId}}</td>' +
	'<td><button v-on:click="deleteConv(ms.accountId,ms.conversationId,index)" type="button" class="btn btn-danger btn-sm" >Закрыть</button></td>' +
	'</tr>' +
	'</tbody>'+
	'</table>'+
	'</div>'+
	'<div v-else>'+
	'<div class="alert alert-danger"><strong>Ошибка!</strong> Нет активных обращений, пробую получить данные</div>'+
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
			setTimeout(this.getAssigneeCounts, timeToUpdate)
		},
		getAccountsCounts: function(){
			this.$http.get('/account/response.json')
			.then(response => {
				this.countAccounts = response.body.length
			})
			setTimeout(this.getAccountsCounts, timeToUpdate)
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