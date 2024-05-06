import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Ellipsis } from 'lucide-react';

const TenantList = () => {
  return (
    <div className="flex items-center justify-between w-full h-full mx-5 my-3">
      <div>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <div className="ml-4">name</div>
      <div className="ml-auto">
        <Ellipsis />
      </div>
    </div>
  );
};

export default TenantList;
