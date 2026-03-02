interface Props {
  children: React.ReactNode;
  className?: string;
}

// サイト全体で統一する最大幅+左右パディングのコンテナ
export default function ContentWrapper({ children, className = "" }: Props) {
  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`.trim()}>
      {children}
    </div>
  );
}
