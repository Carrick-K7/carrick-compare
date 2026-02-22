import { cn } from '@/utils';

type RegionLevel = 'province' | 'city' | 'district' | 'county_city';

interface LevelBadgeProps {
  level: RegionLevel;
  className?: string;
}

const levelConfig: Record<RegionLevel, { label: string; className: string }> = {
  province: { label: '省', className: 'bg-blue-100 text-blue-700' },
  city: { label: '地级市', className: 'bg-green-100 text-green-700' },
  district: { label: '市辖区', className: 'bg-purple-100 text-purple-700' },
  county_city: { label: '县级市', className: 'bg-orange-100 text-orange-700' },
};

/**
 * 行政区划层级标签组件
 * 根据区域层级显示对应的标签和颜色
 */
export function LevelBadge({ level, className }: LevelBadgeProps) {
  const config = levelConfig[level];
  
  if (!config) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export default LevelBadge;
