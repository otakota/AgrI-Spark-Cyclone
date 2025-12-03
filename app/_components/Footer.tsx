export default function Footer() {
    return(
    <footer className="border-t bg-white dark:bg-gray-900 md: px-15">
      <div className="container mx-auto grid gap-4 py-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold">A</span>
            <span className="text-lg font-extrabold tracking-tight">AgriSparkCyclone</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            新規就農者のための申請書自動入力とAI収支予測プラットフォーム。
          </p>
        </div>
        <div className="flex items-end md:justify-end">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} AgriSparkCyclone</p>
        </div>
      </div>
    </footer>
    );
}