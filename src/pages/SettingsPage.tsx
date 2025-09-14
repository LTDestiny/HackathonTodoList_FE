import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardTransition } from "@/components/PageTransition";

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <CardTransition>
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Trang cài đặt đang được phát triển...
            </p>
          </CardContent>
        </Card>
      </CardTransition>
    </div>
  );
};

export default SettingsPage;
