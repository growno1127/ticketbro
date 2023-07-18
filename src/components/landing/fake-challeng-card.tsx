const FakeChallengeCard = () => (
  <>
    <div className="flex flex-col rounded-3xl absolute top-0 right-0 bg-background dark:bg-zinc-900 p-8 border dark:border-zinc-600 border-neutral-300 h-3/4 w-96 shadow-[0_0_1rem_#8884,1rem_-1rem_3rem_-0.5rem_#0004]"
    >
      <h2 className="text-xl font-bold">Implement a JSON parser type</h2>
      <div className="flex gap-3">
        <div className="bg-zinc-700 font-bold px-3 py-1 rounded-full">@you</div>
      </div>
      <div className="rounded-xl -mx-2 bg-neutral-200 dark:bg-zinc-800 flex-grow mt-28"></div>
    </div>
    <div className="flex flex-col rounded-3xl absolute top-36 right-12 bg-background dark:bg-zinc-900 p-8 border dark:border-zinc-600 border-neutral-300 h-4/5 w-96 
    shadow-[0_0_1rem_#8884,1rem_-1rem_3rem_-0.5rem_#0004]"
    >
      <h2 className="text-xl font-bold">Implement a generic type</h2>
      <div className="rounded-xl -mx-2 bg-neutral-200 dark:bg-zinc-800 flex-grow mt-28"></div>
    </div>
  </>
)
export default FakeChallengeCard