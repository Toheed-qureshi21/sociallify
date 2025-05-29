import LoginContent from "@/components/LoginContent";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function AuthTabs() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" className="hover:cursor-pointer ">Login</TabsTrigger>
          <TabsTrigger value="signup" className="hover:cursor-pointer">Signup</TabsTrigger>
        </TabsList>

        {/* ---------- LOGIN ---------- */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Login</CardTitle>
            </CardHeader>

            <LoginContent isLogin={true}/>
          </Card>
        </TabsContent>

        {/* ---------- SIGN-UP ---------- */}
        <TabsContent value="signup" >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign up</CardTitle>
            </CardHeader>

            <LoginContent isLogin={false} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
