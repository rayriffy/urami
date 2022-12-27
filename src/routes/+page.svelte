<script lang="ts">
  import Image from '$lib'
</script>

<main class="max-w-xl mx-auto m-4 py-4">
  <section class="">
    <h1 class="text-gray-900 font-bold text-3xl">svelte-aio</h1>
    <p class="text-gray-700">Automatic image optimization for SvelteKit.</p>
  </section>

  <section class="py-8">
    <a
      href="https://github.com/rayriffy/svelte-aio"
      class="inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      Documentation
    </a>
  </section>

  <h2 class="text-2xl font-bold pb-4">Demo</h2>
  <Image
    src="https://demo.rayriffy.com/tom-scott.jpg"
    width={801}
    height={801}
    alt="Tom Scott"
    class="rounded-xl shadow-md"
  />
</main>

