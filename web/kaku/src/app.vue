<template>

	<header>
		<poi-header></poi-header>
	</header>

	<section>
	    <div class="page">
    	    <router-view transition="expand"></router-view>
    	</div>
	</section>

	<footer>
	    <poi-footer></poi-footer>
	</footer>

</template>

<script>
	import poiHeader from './components/header.vue';
	import poiFooter from './components/footer.vue';

	window.header = poiHeader;

	export default {
		data() {
			return {
				
			}
		},
		components: {
			poiHeader,
			poiFooter
		},
		methods: {
			
		},
		created() {

		}
	};
</script>

<style>
	
	p {
		font-size: 2em;
	}

</style>
